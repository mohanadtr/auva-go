"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { theme, toggle } = useTheme();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [open]);

    if (!user) return null;

    const displayName = user.name || user.username;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white hover:bg-brand-600 transition-colors overflow-hidden"
            >
                {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                    initial
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border bg-[hsl(var(--card))] shadow-lg z-50">
                    {/* Profile section */}
                    <div className="flex items-center gap-3 p-4 border-b">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                                initial
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{displayName}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="py-1">
                        <a
                            href="https://account.auva.dev/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                            <User className="h-4 w-4" />
                            Manage account
                        </a>
                    </div>

                    {/* Products */}
                    <div className="border-t py-1">
                        <a
                            href="https://auva.dev"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600 dark:text-neutral-400"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                            Auva Home
                        </a>
                        <a
                            href="https://paste.auva.dev"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            Auva Paste
                        </a>
                        <a
                            href="https://notes.auva.dev"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                            Auva Notes
                        </a>
                    </div>

                    {/* Theme + Sign out */}
                    <div className="border-t py-1">
                        <button
                            onClick={toggle}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--muted))] transition-colors text-left"
                        >
                            {theme === "dark" ? (
                                <>
                                    <Sun className="h-4 w-4" />
                                    Light mode
                                </>
                            ) : (
                                <>
                                    <Moon className="h-4 w-4" />
                                    Dark mode
                                </>
                            )}
                        </button>
                        <button
                            onClick={async () => {
                                setOpen(false);
                                await logout();
                                router.push("/");
                                router.refresh();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
