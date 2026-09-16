export function hasAbortController(): boolean {
  return typeof AbortController === "function";
}

export function hasTextDecoder(): boolean {
  return typeof TextDecoder === "function";
}
