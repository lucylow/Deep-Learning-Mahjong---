export function shouldUseWebStorage(platform: string, hasStorage: boolean): boolean {
  return platform === "web" && hasStorage;
}
