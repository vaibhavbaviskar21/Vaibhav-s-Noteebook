import { createHighlighter } from "shiki";

let highlighterInstance: any = null;

async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "python",
        "javascript",
        "typescript",
        "bash",
        "sql",
        "go",
        "rust",
        "c",
        "cpp",
        "java",
        "json",
        "markdown",
        "html",
        "css"
      ],
    });
  }
  return highlighterInstance;
}

/**
 * Escapes HTML characters for safe rendering before highlighting.
 */
function escapeHtml(txt: string): string {
  return txt
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * A robust, high-fidelity markdown parser that runs on the client/runtime
 * and performs Shiki syntax highlighting on discovered code-blocks.
 */
export async function renderMarkdown(content: string, isDarkMode: boolean): Promise<string> {
  if (!content) return "";

  let highlighter;
  try {
    highlighter = await getHighlighter();
  } catch (err) {
    console.error("Failed to load shiki highlighter:", err);
  }

  const theme = isDarkMode ? "github-dark" : "github-light";

  // Temporary container to process code blocks
  const codeBlocks: { [key: string]: string } = {};
  let blockCounter = 0;

  // 1. Process block code chunks: ```lang ... ```
  let processed = content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || "text";
    const codeTrimmed = code.trim();
    const blockKey = `%%CODE_BLOCK_PLACEHOLDER_${blockCounter++}%%`;

    let highlightedHtml = "";
    if (highlighter && highlighter.getLoadedLanguages().includes(language)) {
      try {
        highlightedHtml = highlighter.codeToHtml(codeTrimmed, {
          lang: language,
          theme: theme,
        });
      } catch (e) {
        console.error("Shiki helper failure:", e);
        highlightedHtml = `<pre class="shiki" style="background-color: #09090b; padding: 1rem; border-radius: 0.375rem; overflow-x: auto;"><code class="language-${language}">${escapeHtml(codeTrimmed)}</code></pre>`;
      }
    } else {
      // Return standard fallback code block
      highlightedHtml = `<pre class="shiki" style="background-color: #09090b; padding: 1rem; border-radius: 0.375rem; overflow-x: auto;"><code class="language-${language}">${escapeHtml(codeTrimmed)}</code></pre>`;
    }

    // Wrap in targetable box with copy-control header
    const finalBlock = `
<div class="relative group my-6 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden font-mono text-sm leading-relaxed bg-[#09090b]">
  <div class="flex items-center justify-between px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
    <span class="font-medium tracking-wide uppercase">${language}</span>
    <button 
      class="hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors flex items-center gap-1 active:scale-95"
      onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(codeTrimmed)}')).then(() => {
        const text = this.innerText;
        this.innerText = 'Copied!';
        setTimeout(() => { this.innerText = text; }, 1500);
      })"
    >
      Copy
    </button>
  </div>
  <div class="overflow-x-auto p-4 max-h-[80vh]">
    ${highlightedHtml}
  </div>
</div>`;

    codeBlocks[blockKey] = finalBlock;
    return blockKey;
  });

  // 2. Parse general Markdown structures
  // Split content by lines to build structured list items, header lines, and paragraphs
  const lines = processed.split("\n");
  let insideList = false;
  let isOrdered = false;
  let insideQuote = false;

  const htmlLines = lines.map((line) => {
    // Treat code placeholders immediately
    if (line.trim().startsWith("%%CODE_BLOCK_PLACEHOLDER_") && line.trim().endsWith("%%")) {
      let out = line.trim();
      if (insideList) {
        insideList = false;
        out = (isOrdered ? "</ol>\n" : "</ul>\n") + out;
      }
      if (insideQuote) {
        insideQuote = false;
        out = "</blockquote>\n" + out;
      }
      return out;
    }

    // Headers
    const h6Match = line.match(/^######\s+(.*)$/);
    if (h6Match) return `<h6 class="text-sm font-bold mt-4 mb-2 font-sans">${h6Match[1]}</h6>`;
    const h5Match = line.match(/^#####\s+(.*)$/);
    if (h5Match) return `<h5 class="text-base font-bold mt-4 mb-2 font-sans">${h5Match[1]}</h5>`;
    const h4Match = line.match(/^####\s+(.*)$/);
    if (h4Match) return `<h4 class="text-lg font-bold mt-5 mb-2 font-sans">${h4Match[1]}</h4>`;
    const h3Match = line.match(/^###\s+(.*)$/);
    if (h3Match) return `<h3 class="text-xl font-semibold mt-6 mb-3 font-sans border-b border-zinc-100 dark:border-zinc-800 pb-2">${h3Match[1]}</h3>`;
    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) return `<h2 class="text-2xl font-bold mt-8 mb-4 font-sans tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-2">${h2Match[1]}</h2>`;
    const h1Match = line.match(/^#\s+(.*)$/);
    if (h1Match) return `<h1 class="text-3xl font-extrabold mt-10 mb-6 font-sans tracking-tight">${h1Match[1]}</h1>`;

    // Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***") {
      return '<hr class="my-8 border-t border-zinc-200 dark:border-zinc-800" />';
    }

    // Blockquote
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      let listPrefix = "";
      if (insideList) {
        insideList = false;
        listPrefix = isOrdered ? "</ol>\n" : "</ul>\n";
      }
      if (!insideQuote) {
        insideQuote = true;
        return `${listPrefix}<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 my-4 italic text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 rounded-r">${quoteMatch[1]}`;
      }
      return quoteMatch[1];
    } else if (insideQuote) {
      insideQuote = false;
      return "</blockquote>\n" + line;
    }

    // Checklist or Unordered List
    const ulMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (ulMatch) {
      const content = ulMatch[1];
      let prefix = "";
      if (!insideList || isOrdered) {
        prefix = insideList ? (isOrdered ? "</ol>\n" : "</ul>\n") : "";
        insideList = true;
        isOrdered = false;
        prefix += '<ul class="list-disc list-inside pl-5 my-4 space-y-1.5">';
      }

      // Checkbox support e.g. - [ ] Task
      const checkboxMatch = content.match(/^\[([ xX])\]\s+(.*)$/);
      if (checkboxMatch) {
        const checked = checkboxMatch[1] !== " ";
        return `${prefix}<li class="list-none flex items-start gap-2.5"><input type="checkbox" disabled checked=${checked} class="mt-1.5 h-4 w-4 accent-indigo-500 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" /> <span>${checkboxMatch[2]}</span></li>`;
      }

      return `${prefix}<li>${content}</li>`;
    }

    // Ordered List
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const content = olMatch[2];
      let prefix = "";
      if (!insideList || !isOrdered) {
        prefix = insideList ? (isOrdered ? "</ol>\n" : "</ul>\n") : "";
        insideList = true;
        isOrdered = true;
        prefix += '<ol class="list-decimal list-inside pl-5 my-4 space-y-1.5">';
      }
      return `${prefix}<li>${content}</li>`;
    }

    // Reset lists on blank line
    if (line.trim() === "") {
      let out = "";
      if (insideList) {
        insideList = false;
        out += isOrdered ? "</ol>\n" : "</ul>\n";
      }
      if (insideQuote) {
        insideQuote = false;
        out += "</blockquote>\n";
      }
      return out;
    }

    // Standard paragraph line (if not inside an expanded block)
    return `<p class="my-4 leading-relaxed font-serif text-[18px] text-zinc-800 dark:text-zinc-200">${line}</p>`;
  });

  // End any trailing open lists
  let outputHtml = htmlLines.join("\n");
  if (insideList) {
    outputHtml += isOrdered ? "</ol>\n" : "</ul>\n";
  }
  if (insideQuote) {
    outputHtml += "</blockquote>\n";
  }

  // 3. Render inline formatting: Links, Images, Bold, Italic, Inline Code
  // Images: ![alt](src)
  outputHtml = outputHtml.replace(/!\[(.*?)\]\((.*?)\)/g, '<img referrerPolicy="no-referrer" src="$2" alt="$1" style="max-height: 480px; width: 100%; object-fit: cover; border-radius: 0.5rem; margin: 1.5rem 0;" />');

  // Links: [text](href)
  outputHtml = outputHtml.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-500 hover:underline font-medium">$1</a>');

  // Bold: **text** or __text__
  outputHtml = outputHtml.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-900 dark:text-white">$1</strong>');
  outputHtml = outputHtml.replace(/__(.*?)__/g, '<strong class="font-bold text-zinc-900 dark:text-white">$1</strong>');

  // Italics: *text* or _text_
  outputHtml = outputHtml.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  outputHtml = outputHtml.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

  // Inline Code: `code`
  outputHtml = outputHtml.replace(/`(.*?)`/g, '<code class="bg-zinc-100 dark:bg-zinc-900 text-indigo-500 dark:text-indigo-400 font-mono text-sm px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800/50">$1</code>');

  // 4. Put back the highlighted code-blocks
  for (const [placeholder, codeBlockHtml] of Object.entries(codeBlocks)) {
    outputHtml = outputHtml.replace(placeholder, codeBlockHtml);
  }

  return outputHtml;
}
