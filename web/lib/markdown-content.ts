function normalizeLine(line: string) {
  return line
    .replace(/\*\*\s+([^*\n]+?)\s*\*\*/g, "**$1**")
    .replace(/\*\*([^*\n]*?\S)[ \t]+\*\*/g, "**$1**")
    .replace(/([^\n])(?=\*\*[^*\n]{1,20}[：:]\*\*)/g, "$1\n\n")
    .replace(/(\*\*[^*\n]{1,20}[：:]\*\*)(?=\S)/g, "$1 ")
    .replace(/([。！？；：）】》”’])\s+(#{1,6})[ \t]+/g, "$1\n\n$2 ")
    .replace(/([。！？；：）】》”’])\s+-[ \t]+(?=\S)/g, "$1\n\n- ");
}

export function normalizeGeneratedMarkdown(content: string) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  let inFence = false;

  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;

      const normalized = normalizeLine(line);
      const standaloneBold = normalized.match(/^\s*\*\*\s*(.+?)\s*\*\*\s*$/);
      return standaloneBold ? `## ${standaloneBold[1].trim()}` : normalized;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
