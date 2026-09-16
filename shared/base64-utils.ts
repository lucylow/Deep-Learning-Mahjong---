function decodeBinaryUtf8(binary: string): string {
  const bytes = Array.from(binary, (character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`);
  try {
    return decodeURIComponent(bytes.join(""));
  } catch {
    return binary;
  }
}

function decodeBase64BinaryFallback(value: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  let binary = "";
  let buffer = 0;
  let bits = 0;

  for (const character of padded) {
    if (character === "=") break;
    const index = alphabet.indexOf(character);
    if (index < 0) throw new Error("Invalid base64 input.");
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      binary += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return binary;
}

/**
 * Decode OAuth base64 payloads without relying on Node's Buffer global.
 * Supports native Hermes, browsers, and Expo Router's Node-based static renderer.
 */
export function decodeBase64Utf8(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary =
    typeof globalThis.atob === "function"
      ? globalThis.atob(normalized)
      : decodeBase64BinaryFallback(normalized);
  return decodeBinaryUtf8(binary);
}
