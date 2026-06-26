import { Post } from "../types";
import { savePost } from "./supabase";

/**
 * Checks for all scheduled posts that are due to be published.
 * If scheduledAt is in the past, changes status to 'published',
 * sets publishedAt to now, and updates Firestore.
 */
export async function checkAndPublish(posts: Post[]): Promise<boolean> {
  let updatedAny = false;
  const nowStr = new Date();

  for (const post of posts) {
    if (post.status === "scheduled" && post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt);
      if (scheduledDate <= nowStr) {
        try {
          const updated: Post = {
            ...post,
            status: "published",
            publishedAt: new Date(),
            updatedAt: new Date(),
          };
          await savePost(updated);
          updatedAny = true;
          console.log(`Auto-Published post successfully: ${post.title}`);
        } catch (err) {
          console.error(`Failed to auto-publish post ${post.id}:`, err);
        }
      }
    }
  }

  return updatedAny;
}

/**
 * Generates a human-friendly countdown description till release.
 */
export function getCountdownString(scheduledDateInput: any): string {
  if (!scheduledDateInput) return "";
  const target = new Date(scheduledDateInput);
  const diffMs = target.getTime() - new Date().getTime();

  if (diffMs <= 0) return "Due now";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    return `in ${days}d ${diffHours % 24}h`;
  }

  if (diffHours > 0) {
    return `in ${diffHours}h ${diffMins}m`;
  }

  return `in ${diffMins}m`;
}
