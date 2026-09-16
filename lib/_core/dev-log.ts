export function isDevelopmentRuntime(): boolean {
  return typeof process === "undefined" || process.env?.NODE_ENV !== "production";
}

export function devLog(...args: unknown[]): void {
  if (isDevelopmentRuntime()) console.log(...args);
}

export function devDebug(...args: unknown[]): void {
  if (isDevelopmentRuntime()) console.debug(...args);
}
