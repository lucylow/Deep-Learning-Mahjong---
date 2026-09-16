export type NavigationAction = () => void | Promise<void>;

export function getActiveMatchId(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export async function runNavigation(action: NavigationAction, onError?: (error: unknown) => void): Promise<boolean> {
  try {
    await action();
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
}
