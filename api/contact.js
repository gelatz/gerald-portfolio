const recipientEmail = 'geraldfuntanar@gmail.com'
const rateLimitWindowMs = 15 * 60 * 1000
const rateLimitMaxRequests = 5
const rateLimitStore = globalThis.__portfolioContactRateLimit ?? new Map()
const gmailTokenCache = globalThis.__portfolioGmailToken ?? { accessToken: '', expiresAt: 0 }

globalThis.__portfolioContactRateLimit = rateLimitStore
globalThis.__portfolioGmailToken = gmailTokenCache

function normalize(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function validatePayload(payload) {
  const values = {
    name: normalize(payload?.name),
    email: normalize(payload?.email).toLowerCase(),
    subject: normalize(payload?.subject).replace(/[\r\n]+/g, ' '),
    message: normalize(payload?.message),
    website: normalize(payload?.website),
  }

  if (values.website) return { values, bot: true }
  if (values.name.length < 2 || values.name.length > 100) return { error: 'Please enter a valid name.' }
  if (values.email.length > 254 || !/^[a-z0-9._%+-]+@gmail\.com$/i.test(values.email)) return { error: 'Please use a valid @gmail.com address.' }
  if (values.subject.length < 3 || values.subject.length > 150) return { error: 'Please enter a subject between 3 and 150 characters.' }
  if (values.message.length < 10 || values.message.length > 5000) return { error: 'Please enter a message between 10 and 5,000 characters.' }

  return { values, bot: false }
}

function isRateLimited(request) {
  const forwardedFor = request.headers['x-forwarded-for']
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || request.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const now = Date.now()
  const previous = rateLimitStore.get(ip)

  if (!previous || now - previous.startedAt > rateLimitWindowMs) {
    rateLimitStore.set(ip, { count: 1, startedAt: now })
    return false
  }

  previous.count += 1
  return previous.count > rateLimitMaxRequests
}

function hasValidOrigin(request) {
  const origin = request.headers.origin
  if (!origin) return true

  const forwardedHost = request.headers['x-forwarded-host']
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || request.headers.host

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function encodeHeader(value) {
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`
}

function encodeMimePart(value) {
  const encoded = Buffer.from(value, 'utf8').toString('base64')
  return encoded.match(/.{1,76}/g)?.join('\r\n') || ''
}

function encodeBase64Url(value) {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/g, '')
}

function buildRawMessage({ name, email, subject, message, senderEmail }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />')
  const plainText = `New portfolio message\n\nName: ${name}\nGmail: ${email}\nSubject: ${subject}\n\n${message}`
  const html = `
    <div style="background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#172033">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #dfe7f1;border-radius:16px;overflow:hidden">
        <div style="padding:24px 28px;background:#07111f;color:#ffffff">
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4ea5ff">Portfolio inquiry</div>
          <h1 style="margin:8px 0 0;font-size:24px">${safeSubject}</h1>
        </div>
        <div style="padding:28px">
          <p style="margin:0 0 8px"><strong>From:</strong> ${safeName}</p>
          <p style="margin:0 0 24px"><strong>Gmail:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <div style="padding:20px;background:#f5f8fc;border-radius:10px;line-height:1.65">${safeMessage}</div>
        </div>
      </div>
    </div>
  `.trim()
  const boundary = `portfolio_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const mimeMessage = [
    `From: Gerald Portfolio <${senderEmail}>`,
    `To: ${recipientEmail}`,
    `Reply-To: ${email}`,
    `Subject: ${encodeHeader(`[Portfolio] ${subject}`)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodeMimePart(plainText),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodeMimePart(html),
    `--${boundary}--`,
  ].join('\r\n')

  return encodeBase64Url(mimeMessage)
}

function getMissingGmailConfig() {
  return ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN'].filter((key) => !process.env[key])
}

async function getGmailAccessToken() {
  if (gmailTokenCache.accessToken && Date.now() < gmailTokenCache.expiresAt - 60_000) {
    return gmailTokenCache.accessToken
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })

  if (!tokenResponse.ok) {
    console.error('Gmail OAuth token refresh failed with status:', tokenResponse.status)
    throw new Error('Gmail authentication failed.')
  }

  const token = await tokenResponse.json()
  if (!token.access_token) throw new Error('Gmail did not return an access token.')

  gmailTokenCache.accessToken = token.access_token
  gmailTokenCache.expiresAt = Date.now() + Number(token.expires_in || 3600) * 1000
  return gmailTokenCache.accessToken
}

async function sendGmailMessage(rawMessage, canRetry = true) {
  const accessToken = await getGmailAccessToken()
  const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawMessage }),
  })

  if (gmailResponse.status === 401 && canRetry) {
    gmailTokenCache.accessToken = ''
    gmailTokenCache.expiresAt = 0
    return sendGmailMessage(rawMessage, false)
  }

  if (!gmailResponse.ok) {
    console.error('Gmail API send failed with status:', gmailResponse.status)
    throw new Error('Gmail delivery failed.')
  }

  return gmailResponse.json()
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  if (!hasValidOrigin(request)) {
    return response.status(403).json({ error: 'Request origin is not allowed.' })
  }

  if (isRateLimited(request)) {
    return response.status(429).json({ error: 'Too many messages were sent. Please wait a few minutes and try again.' })
  }

  let payload = request.body
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return response.status(400).json({ error: 'Invalid request body.' })
    }
  }

  const validation = validatePayload(payload)
  if (validation.error) return response.status(400).json({ error: validation.error })
  if (validation.bot) return response.status(200).json({ sent: true })

  if (getMissingGmailConfig().length) {
    return response.status(503).json({ error: 'Gmail delivery is not configured yet. Please contact me directly by email.' })
  }

  const senderEmail = normalize(process.env.GMAIL_SENDER_EMAIL) || recipientEmail

  try {
    const rawMessage = buildRawMessage({ ...validation.values, senderEmail })
    const result = await sendGmailMessage(rawMessage)
    return response.status(200).json({ sent: true, id: result.id })
  } catch (error) {
    console.error('Contact Gmail delivery error:', error instanceof Error ? error.message : 'Unknown error')
    return response.status(502).json({ error: 'Gmail delivery failed. Please try again or contact me directly.' })
  }
}
