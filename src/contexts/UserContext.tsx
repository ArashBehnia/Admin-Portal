"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/lib/auth";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
    user: initialUser,
    children,
}: {
    user: User | null;
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(initialUser);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    return context?.user ?? null;
}

export function useSetUser() {
    const context = useContext(UserContext);
    return context?.setUser ?? (() => {});
}
