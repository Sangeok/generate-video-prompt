export function parseGeminiJsonResponse<T>(responseText: string): T {
  const jsonString = responseText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    throw new Error(
      `Gemini JSON 파싱 실패: ${error instanceof Error ? error.message : String(error)}\n원본 응답: ${responseText.slice(0, 500)}`,
      { cause: error }
    );
  }
}
