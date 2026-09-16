export type StoredUserPayload = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: string | number | Date;
};

export function isStoredUserPayload(value: unknown): value is StoredUserPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const lastSignedIn = candidate.lastSignedIn;
  const validDate = lastSignedIn instanceof Date || ((typeof lastSignedIn === "string" || typeof lastSignedIn === "number") && !Number.isNaN(new Date(lastSignedIn).getTime()));
  return typeof candidate.id === "number" && typeof candidate.openId === "string" && (candidate.name === null || typeof candidate.name === "string") && (candidate.email === null || typeof candidate.email === "string") && (candidate.loginMethod === null || typeof candidate.loginMethod === "string") && validDate;
}
