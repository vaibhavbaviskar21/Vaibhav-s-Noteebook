import { createClient } from "@supabase/supabase-js";
import { Section, Folder, Post, SiteSettings } from "../types";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Publishable Key is missing from environment variables.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

function handleSupabaseError(error: any, operation: string, table: string): never {
  const msg = `Supabase Error during ${operation} on ${table}: ${error?.message || JSON.stringify(error)}`;
  console.error(msg, error);
  throw new Error(msg);
}

// Helper to check if database is empty, and seed beautiful initial content
export async function seedDatabase(force = false) {
  try {
    if (!force) {
      const { data: sectionsSnap, error: secErr } = await supabase.from("sections").select("id").limit(1);
      if (secErr) throw secErr;
      if (sectionsSnap && sectionsSnap.length > 0) {
        console.log("Database already seeded.");
        return;
      }
    }

    console.log("Empty database detected. Seeding initial data for Vaibhav's Brain...");

    if (force) {
      // Delete existing records (cascade foreign keys will clean up related folders & posts)
      const { error: delSecErr } = await supabase.from("sections").delete().neq("id", "");
      if (delSecErr) throw delSecErr;
      
      const { error: delSetErr } = await supabase.from("settings").delete().eq("id", "site");
      if (delSetErr) throw delSetErr;
    }

    // 1. Initial Sections
    const initialSections: Section[] = [
      { id: "sec-blog", name: "Personal Blog", slug: "blog", icon: "✍️", order: 1 },
      { id: "sec-projects", name: "Project Ideas", slug: "projects", icon: "🚀", order: 2 },
      { id: "sec-notes", name: "DSA & Tech Notes", slug: "notes", icon: "🧠", order: 3 },
      { id: "sec-ctf", name: "CTF Writeups", slug: "ctf", icon: "🚩", order: 4 },
    ];

    const { error: insSecErr } = await supabase.from("sections").insert(initialSections);
    if (insSecErr) throw insSecErr;

    // 2. Initial Folders (inserted with root folders first then child folders to satisfy constraints)
    const initialFolders: Folder[] = [
      { id: "fol-algorithms", sectionId: "sec-notes", parentFolderId: null, name: "Algorithms", order: 1 },
      { id: "fol-graphs", sectionId: "sec-notes", parentFolderId: "fol-algorithms", name: "Graph Algorithms", order: 1 },
      { id: "fol-web-projects", sectionId: "sec-projects", parentFolderId: null, name: "Web Prototypes", order: 1 },
    ];

    const rootFolders = initialFolders.filter((f) => !f.parentFolderId);
    const childFolders = initialFolders.filter((f) => f.parentFolderId);

    if (rootFolders.length > 0) {
      const { error: insRootFolErr } = await supabase.from("folders").insert(rootFolders);
      if (insRootFolErr) throw insRootFolErr;
    }
    if (childFolders.length > 0) {
      const { error: insChildFolErr } = await supabase.from("folders").insert(childFolders);
      if (insChildFolErr) throw insChildFolErr;
    }

    // 3. Initial Posts
    const now = new Date().toISOString();
    const initialPosts = [
      {
        id: "post-welcome",
        sectionId: "sec-blog",
        folderId: null,
        title: "Welcome to Vaibhav's Brain!",
        slug: "welcome-to-vaibhavs-brain",
        content: `# Welcome to my Private Knowledge Base & Blog\n\nThis is a modern digital garden where **personal notebook** utility meets a sleek public **blog**. Powered by a private mind-map graph, it helps track thoughts and connections on the fly!\n\n## Key Features\n\n1. **Collapsible Nested Folders**: Organise sections with infinite hierarchy.\n2. **Interactive Mind Map (React Flow)**: Visualise task dependencies and ideas dynamically.\n3. **Drafting with Autosave**: Keep writing on the go, with drafts secured to Firestore.\n4. **Syntax Highlighting**: Beautiful styles for high-fidelity code logs.\n\nHere's a quick code highlight test in TypeScript:\n\n\`\`\`typescript\nconst brainOwner = \"Vaibhav\";\nconsole.log(\`🧠 \${brainOwner}'s digital workspace online!\`);\n\`\`\`\n\nEnjoy exploring!`,
        excerpt: "An introduction to Vaibhav's Brain – a personal knowledge base and lightweight blog.",
        tags: ["intro", "showcase", "mindmap"],
        status: "published",
        scheduledAt: null,
        publishedAt: now,
        coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200",
        links: ["post-mindmap-guide", "post-project-1"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "post-mindmap-guide",
        sectionId: "sec-blog",
        folderId: null,
        title: "Guide to the Interactive Mind Map",
        slug: "guide-to-mind-map",
        content: `# Tracking Project Ideas & Task Dependencies\n\nOur graph view at \`/graph\` renders as a living mind-map representation of everything stored in Vaibhav's Brain.\n\n### How Connections Work\nIn the editor sidebar, you can select **Linked Posts** (which acts as edges in our network). Setting these connections creates lines between posts on our full-screen react-flow map.\n\n* **Colors**: Each node is color-coded based on its section (e.g. Indigo for Projects, Emerald for Tech Notes).\n* **Usage**: Focus-down on complicated dependencies: if Project B depends on learning algorithm A, create a link from B to A. Clicking a node lets you read the draft or public writeup instantly!`,
        excerpt: "Learn how the Interactive Graph View links posts and tracks dependencies.",
        tags: ["graph", "docs", "interact"],
        status: "published",
        scheduledAt: null,
        publishedAt: now,
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        links: ["post-welcome"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "post-project-1",
        sectionId: "sec-projects",
        folderId: "fol-web-projects",
        title: "Collaborative Mind Map Applet",
        slug: "collaborative-mind-map-applet",
        content: `# Project Idea: Multi-User Mindmapper\n\nA collaborative, real-time node dragging editor with persistent D3 force engines.\n\n### Roadmap\n- [x] Configure Firebase backend\n- [x] Render tree routing\n- [ ] Connect multi-user sockets\n- [ ] Complete auto-layout algorithms\n\nRelated Algorithms: [Dijkstra's Shortest Path](/notes?post=post-dijkstra)`,
        excerpt: "A high-fidelity project outline for a browser-based collaborative flowchart editor.",
        tags: ["project", "web", "react-flow"],
        status: "published",
        scheduledAt: null,
        publishedAt: now,
        coverImage: null,
        links: ["post-welcome", "post-dijkstra"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "post-dijkstra",
        sectionId: "sec-notes",
        folderId: "fol-graphs",
        title: "Dijkstra's Shortest Path Algorithm",
        slug: "dijkstras-shortest-path-algorithm",
        content: `# Dijkstra's Shortest Path\n\nGreat for finding path solutions in weighted graph nodes!\n\n\`\`\`python\nimport heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    queue = [(0, start)]\n    \n    while queue:\n        current_distance, current_node = heapq.heappop(queue)\n        \n        if current_distance > distances[current_node]:\n            continue\n            \n        for neighbor, weight in graph[current_node].items():\n            distance = current_distance + weight\n            if distance < distances[neighbor]:\n                distances[neighbor] = distance\n                heapq.heappush(queue, (distance, neighbor))\n                \n    return distances\n\`\`\`\n\nLinked dependency for **Collaborative Mind Map Applet** project.`,
        excerpt: "Standard textbook Dijkstra path-finding tutorial with high-perf Python code.",
        tags: ["ds-algo", "python", "graphs"],
        status: "published",
        scheduledAt: null,
        publishedAt: now,
        coverImage: null,
        links: ["post-project-1"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const { error: insPostErr } = await supabase.from("posts").insert(initialPosts);
    if (insPostErr) throw insPostErr;

    // 4. Default Settings
    const defaultSettings: SiteSettings = {
      id: "site",
      title: "Vaibhav's Brain",
      tagline: "A personal space to write, think and build in public.",
      twitter: "https://twitter.com/vaibhav",
      github: "https://github.com/vaibhav",
      linkedin: "https://linkedin.com/in/vaibhav",
    };
    
    const { error: insSettErr } = await supabase.from("settings").insert(defaultSettings);
    if (insSettErr) throw insSettErr;

    console.log("Database seeding finished completely!");
  } catch (error) {
    console.error("Error seeding core database:", error);
  }
}

// === SECTIONS HELPERS ===
export async function getSections(): Promise<Section[]> {
  try {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    handleSupabaseError(err, "LIST", "sections");
  }
}

export async function saveSection(section: Section): Promise<void> {
  try {
    const { error } = await supabase.from("sections").upsert(section);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "WRITE", `sections/${section.id}`);
  }
}

export async function deleteSection(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "DELETE", `sections/${id}`);
  }
}

// === FOLDERS HELPERS ===
export async function getFolders(): Promise<Folder[]> {
  try {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    handleSupabaseError(err, "LIST", "folders");
  }
}

export async function saveFolder(folder: Folder): Promise<void> {
  try {
    const { error } = await supabase.from("folders").upsert(folder);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "WRITE", `folders/${folder.id}`);
  }
}

export async function deleteFolder(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "DELETE", `folders/${id}`);
  }
}

// === POSTS HELPERS ===
export async function getPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    return (data || []).map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : null,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    })) as Post[];
  } catch (err) {
    handleSupabaseError(err, "LIST", "posts");
  }
}

export async function getPost(postId: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    } as Post;
  } catch (err) {
    handleSupabaseError(err, "GET", `posts/${postId}`);
  }
}

export async function savePost(post: Post): Promise<void> {
  try {
    const postData = {
      ...post,
      createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString(),
      updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : new Date(post.updatedAt).toISOString(),
      scheduledAt: post.scheduledAt ? (post.scheduledAt instanceof Date ? post.scheduledAt.toISOString() : new Date(post.scheduledAt).toISOString()) : null,
      publishedAt: post.publishedAt ? (post.publishedAt instanceof Date ? post.publishedAt.toISOString() : new Date(post.publishedAt).toISOString()) : null,
    };
    const { error } = await supabase.from("posts").upsert(postData);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "WRITE", `posts/${post.id}`);
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "DELETE", `posts/${postId}`);
  }
}

// === SETTINGS HELPERS ===
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "site")
      .maybeSingle();
    if (error) throw error;
    if (data) return data as SiteSettings;
    return {
      id: "site",
      title: "Vaibhav's Brain",
      tagline: "A personal space to write, think and build in public.",
    };
  } catch (err) {
    handleSupabaseError(err, "GET", "settings/site");
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    const { error } = await supabase.from("settings").upsert(settings);
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "WRITE", "settings/site");
  }
}
