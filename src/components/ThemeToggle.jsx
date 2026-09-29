import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button className="icon-button theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${nextTheme} mode`} title={`Switch to ${nextTheme} mode`}>
      <Sun className="sun-icon" size={18} aria-hidden="true" />
      <Moon className="moon-icon" size={18} aria-hidden="true" />
    </button>
  )
}
