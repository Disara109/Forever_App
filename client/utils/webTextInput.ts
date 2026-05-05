import type { RefObject } from "react";
import { Platform } from "react-native";

/**
 * Chrome autofill can populate the DOM without firing onChangeText, so React state
 * stays empty. On web, read the real input value from the TextInput ref at submit time.
 */
export function valueFromTextInputRef(
  ref: RefObject<unknown>,
  reactState: string
): string {
  if (Platform.OS !== "web") return reactState;
  const node = ref.current as { value?: string } | null;
  const v = node?.value;
  if (typeof v === "string" && v.length > 0) {
    return v;
  }
  return reactState;
}
