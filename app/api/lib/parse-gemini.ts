export function parseGeminiJsonResponse<T>(responseText: string): T {
  const jsonString = responseText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");
  return JSON.parse(jsonString) as T;
}
