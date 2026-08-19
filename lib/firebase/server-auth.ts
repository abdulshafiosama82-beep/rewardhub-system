import "server-only";
import { NextRequest } from "next/server";
import { getAdmin } from "./admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export type Role = "member" | "moderator" | "admin";

export interface AuthedUser extends DecodedIdToken {
  role: Role;
  perms: string[];
}

/**
 * Verifies the Firebase ID token sent in the Authorization: Bearer <token> header.
 * Returns the decoded token enriched with role + perms from custom claims.
 */
export async function verifyRequest(
  req: NextRequest,
): Promise<AuthedUser | null> {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return null;

  try {
    const { auth } = getAdmin();
    const decoded = await auth.verifyIdToken(match[1]);
    const role: Role = (decoded.role as Role) || "member";
    const perms: string[] = (decoded.perms as string[]) || [];
    return { ...decoded, role, perms };
  } catch {
    return null;
  }
}

export function isAdmin(u: AuthedUser | null): boolean {
  return u?.role === "admin";
}

export function isModeratorOrAdmin(u: AuthedUser | null): boolean {
  return u?.role === "admin" || u?.role === "moderator";
}

export function hasPerm(u: AuthedUser | null, perm: string): boolean {
  if (!u) return false;
  if (u.role === "admin") return true;
  return u.perms.includes(perm);
}
