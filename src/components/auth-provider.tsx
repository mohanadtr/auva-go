"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL || process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.auva.dev";

export interface AuthUser {
    userId: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    accessToken: string;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    accessToken: "",
    logout: async () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

function decodeToken(token: string): AuthUser | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) return null;
        if (!payload.userId || !payload.username || !payload.email || !payload.name) return null;
        return {
            userId: payload.userId,
            name: payload.name,
            username: payload.username,
            email: payload.email,
            avatar: payload.avatar || "",
        };
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(`${AUTH_API}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            const token = data.accessToken as string;
            const decoded = decodeToken(token);
            if (!decoded) throw new Error();
            setAccessToken(token);
            setUser(decoded);
        } catch {
            setAccessToken("");
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // Auto-refresh every 13 minutes
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(refresh, 13 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, refresh]);

    const logout = useCallback(async () => {
        try {
            await fetch(`${AUTH_API}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch { /* ignore */ }
        setAccessToken("");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, accessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
