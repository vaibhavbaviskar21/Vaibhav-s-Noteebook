import Fuse from "fuse.js";
import { Post } from "../types";

let fuseInstance: Fuse<Post> | null = null;

export function buildSearchIndex(posts: Post[]) {
  // Only index posts that are published or we are viewing in admin
  const sortedAndFiltered = posts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  fuseInstance = new Fuse(sortedAndFiltered, {
    keys: ["title", "tags", "excerpt"],
    threshold: 0.35,
    includeMatches: true,
  });
}

export function searchPosts(query: string): Post[] {
  if (!fuseInstance) return [];
  if (!query.trim()) {
    // Return all items from the fuse array
    return [...fuseInstance.getIndex().docs];
  }
  const results = fuseInstance.search(query);
  return results.map((r) => r.item);
}
