"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

const navApps = [
  {
    name: "Go",
    href: "/",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    name: "Paste",
    href: "https://paste.auva.dev",
    gradient: "from-emerald-500 to-emerald-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: "Notes",
    href: "https://notes.auva.dev",
    gradient: "from-amber-500 to-amber-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
      </svg>
    ),
  },
];

export function Header() {
  const { user, loading, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) setAppsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/30 bg-white/60 backdrop-blur-xl dark:border-white/5 dark:bg-neutral-950/60">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>Auva <span className="text-blue-600 dark:text-blue-400">Go</span></span>
          </Link>
          {user && (
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white">
                Dashboard
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-1">
          {loading ? (
            <div className="h-5 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ) : (
            <>
              {/* Apps grid */}
              <div className="relative" ref={appsRef}>
                <button
                  onClick={() => { setAppsOpen(!appsOpen); setUserMenuOpen(false); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-500/10 hover:text-neutral-900 transition-colors dark:text-neutral-400 dark:hover:text-white"
                  aria-label="Apps"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <circle cx="6" cy="6" r="1.8"/><circle cx="12" cy="6" r="1.8"/><circle cx="18" cy="6" r="1.8"/>
                    <circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/>
                    <circle cx="6" cy="18" r="1.8"/><circle cx="12" cy="18" r="1.8"/><circle cx="18" cy="18" r="1.8"/>
                  </svg>
                </button>

                {appsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-neutral-200/80 bg-white/80 p-3 shadow-xl backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-900/80">
                    <div className="grid grid-cols-3 gap-1">
                      {navApps.map((app) => (
                        <a
                          key={app.name}
                          href={app.href}
                          onClick={() => setAppsOpen(false)}
                          className="flex flex-col items-center gap-1.5 rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${app.gradient} shadow-sm`}>
                            {app.icon}
                          </div>
                          <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">{app.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {user ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setAppsOpen(false); }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 hover:bg-neutral-300 transition-colors overflow-hidden dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"/></svg>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-neutral-200/80 bg-white/80 shadow-xl backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-900/80">
                      <div className="flex items-center gap-3 p-4 border-b border-neutral-200/50 dark:border-neutral-700/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 overflow-hidden dark:bg-neutral-700 dark:text-neutral-300">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"/></svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="py-1">
                        <a href="https://account.auva.dev/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Manage account
                        </a>
                      </div>

                      <div className="border-t border-neutral-200/50 py-1 dark:border-neutral-700/50">
                        <button
                          onClick={async () => { setUserMenuOpen(false); await logout(); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors text-left"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a href="https://account.auva.dev/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-500/10 dark:text-neutral-300 transition-colors">
                    Sign in
                  </a>
                  <a href="https://account.auva.dev/register" className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                    Sign up
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
