'use client'
import { useState, useEffect } from 'react'
import NotificationPanel from './NotificationPanel'

export default function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pos-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(saved === 'dark' || (!saved && prefersDark))
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('pos-theme', next ? 'dark' : 'light')
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-base shrink-0"
      style={{ backgroundColor: 'var(--color-surface)' }}>

      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="lg:hidden btn-ghost p-2 rounded-pos-md">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>
        )}
        <LiveClock />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button onClick={toggleTheme}
          className="w-9 h-9 rounded-pos-md flex items-center justify-center transition-pos"
          style={{ color: 'var(--color-text-secondary)' }}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark ? (
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          )}
        </button>

        {/* Notifications */}
        <NotificationPanel />
      </div>
    </header>
  )
}

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="text-sm font-mono text-secondary hidden sm:block">{time}</span>
}
