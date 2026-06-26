import { SiteSettings } from "../types";

/**
 * Auto-generates clean slugs from titles (lowercase, letters and hyphens, no special characters)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Automates client-side SEO page headers in the React SPA.
 * Renders page titles, appends branding, and sets head description.
 */
export function updateSEOHeaders(title: string, description: string, coverImage?: string | null, settings?: SiteSettings) {
  const brand = settings?.title || "Vaibhav's Brain";
  const tagline = settings?.tagline || "Personal Knowledge Base & Blog";

  // Set Document Title
  document.title = title ? `${title} | ${brand}` : `${brand} - ${tagline}`;

  // Find or create description tag
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement("meta");
    descMeta.setAttribute("name", "description");
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute("content", description || tagline);

  // Open Graph
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", title || brand);

  let ogImg = document.querySelector('meta[property="og:image"]');
  if (!ogImg) {
    ogImg = document.createElement("meta");
    ogImg.setAttribute("property", "og:image");
    document.head.appendChild(ogImg);
  }
  // If no cover image exists, provide a modern creative standard digital garden fallback gradient
  ogImg.setAttribute(
    "content",
    coverImage ||
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80"
  );
}
export function getReadingTime(text: string): string {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}
export function formatDate(dateInput: any): string {
  if (!dateInput) return "No date provided";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Unknown Date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
