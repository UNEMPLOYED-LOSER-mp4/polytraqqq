export function shortenKey(code) {
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code === "ShiftRight") return "RShift";
  if (code === "ShiftLeft") return "LShift";
  return code;
}
