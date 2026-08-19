"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { apiFetch } from "@/lib/api";

export type Role = "member" | "moderator" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  points: number;
  referralId: string;
  referredBy?: string | null;
  referralsCount: number;
  vouchers: number;
  balanceEGP: number;
  role: Role;
  perms?: string[];
  avatarUrl?: string | null;
  createdAt?: any;
}

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  role: Role;
  perms: string[];
  loading: boolean;
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role>("member");
  const [perms, setPerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Track auth state; bootstrap the profile doc server-side on first login.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          // Ensure server-side profile exists (handles referral linking).
          const referralCode =
            typeof window !== "undefined"
              ? window.localStorage.getItem("arbahi_ref") || undefined
              : undefined;
          await apiFetch("/api/auth/bootstrap", {
            method: "POST",
            body: JSON.stringify({ referralCode }),
          });
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("arbahi_ref");
          }
        } catch (e) {
          // non-fatal; profile subscription below will still attach
          console.log("[v0] bootstrap error", (e as Error).message);
        } finally {
          setBootstrapped(true);
        }
      } else {
        setProfile(null);
        setRole("member");
        setPerms([]);
        setBootstrapped(false);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Read custom claims (role) from the ID token.
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) return;
      const res = await user.getIdTokenResult();
      setRole(((res.claims.role as Role) || "member") as Role);
      setPerms((res.claims.perms as string[]) || []);
    });
    return () => unsub();
  }, []);

  // Subscribe to the user's profile document in realtime.
  useEffect(() => {
    if (!firebaseUser || !bootstrapped) return;
    const ref = doc(db, "users", firebaseUser.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setProfile({ uid: snap.id, ...(snap.data() as any) });
        }
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [firebaseUser, bootstrapped]);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  const refreshClaims = useCallback(async () => {
    if (auth.currentUser) {
      const res = await auth.currentUser.getIdTokenResult(true);
      setRole(((res.claims.role as Role) || "member") as Role);
      setPerms((res.claims.perms as string[]) || []);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ firebaseUser, profile, role, perms, loading, signOut, refreshClaims }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
