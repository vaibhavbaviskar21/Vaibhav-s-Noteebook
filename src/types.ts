/**
 * Core Types for Vaibhav's Brain (Personal Notebook & Blogging Platform)
 */

export interface Section {
  id: string;
  name: string;
  slug: string; // URL slug, e.g., 'projects', 'ctf-writeups'
  icon: string; // Emoji character, e.g., '📂', '🧪'
  order: number;
}

export interface Folder {
  id: string;
  sectionId: string;
  parentFolderId: string | null; // Null or empty string for root of section
  name: string;
  order: number;
}

export interface Post {
  id: string;
  sectionId: string;
  folderId: string | null; // Can be in a folder, or directly at section root
  title: string;
  slug: string;
  content: string; // Markdown content
  excerpt: string; // Short lead text
  tags: string[];
  status: "draft" | "published" | "scheduled" | "private";
  scheduledAt: any | null; // Timestamp (could be Firebase Timestamp or ISO date string in state)
  publishedAt: any | null; // Timestamp
  coverImage: string | null; // URL from Firebase Storage
  links: string[]; // Array of Post IDs (for connection graph view)
  createdAt: any;
  updatedAt: any;
}

export interface SiteSettings {
  id: string;
  title: string;
  tagline: string;
  bio?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface DragItem {
  id: string;
  type: "folder" | "post";
  sectionId: string;
  parentFolderId: string | null;
  name: string;
  order: number;
}
