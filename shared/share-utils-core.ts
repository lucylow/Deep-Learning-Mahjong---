export type ShareResult = { action: string };
export type ShareInvoker = (title: string, message: string) => Promise<ShareResult>;

export async function runShare(invoker: ShareInvoker, title: string, message: string, dismissedAction: string): Promise<boolean> {
  try {
    const result = await invoker(title, message);
    return result.action !== dismissedAction;
  } catch {
    return false;
  }
}
