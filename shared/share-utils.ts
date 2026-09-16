import { Share } from "react-native";
import { runShare } from "@/shared/share-utils-core";

export async function shareText(title: string, message: string): Promise<boolean> {
  return runShare((nextTitle, nextMessage) => Share.share({ title: nextTitle, message: nextMessage }), title, message, Share.dismissedAction);
}
