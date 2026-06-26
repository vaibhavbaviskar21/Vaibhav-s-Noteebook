# 🧠 Vaibhav's Brain — A Digital Garden & Built-in-Public Hub

Welcome to **Vaibhav's Brain**, a minimalist digital garden where personal notebooks meet a high-fidelity public blog. This application was built to act as a **personal knowledge backplane**—a central workspace to log DSA/tech notes, map out project roadmaps, document CTF writeups, and share professional experiences. 

By utilizing an **interactive mind-map graph**, this project aims to support the **"Build in Public"** philosophy, making technical notes and their underlying connections transparent and easy to explore.

---

## 🚀 Why This Was Built

As a developer, keeping notes structured while sharing them publicly can be challenging. I built this platform to serve several purposes:
1. **Documenting Projects & Roadmap Dependencies:** Instead of static project checklists, I wanted an interactive, visual representation of what I am working on, showing how different concepts (e.g., learning a specific graph algorithm) relate to project features.
2. **Writing Technical Blogs & Insights:** Having a unified space to write, edit with markdown, auto-save drafts, and publish articles instantly.
3. **Sharing Experiences & Tech Notes:** A searchable repository of concepts, cheatsheets, and learnings that anyone in the community can access and read.
4. **Building in Public:** Putting my learning journey, ideas, and software progression out in the open to connect with other builders.

---

## ✨ Core Features

* 📁 **Hierarchical Collapsible Folders:** Infinite nested folder structures within workspace sections for tidy, organized documentation.
* 🕸️ **Interactive Mind Map (React Flow):** A full-screen node canvas that visualizes post dependencies and relationships dynamically.
* ✍️ **Markdown Prose Editor with Autosave:** A rich Markdown drafting environment featuring a 30-second background auto-save loop.
* 🔎 **Fuzzy Search (Fuse.js):** Extremely fast client-side query indexing that parses titles, excerpts, and tags instantly.
* 📦 **Supabase Storage Integration:** Drag-and-drop cover image uploads and clipboard image pasting connected directly to Supabase storage buckets.
* 🌗 **Smooth Theme Controls:** Fully integrated dark mode system that is responsive to system theme settings.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS (configured for premium typography and harmonized HSL dark modes)
* **Database & Storage:** Supabase (PostgreSQL tables + public storage buckets)
* **Graph Rendering:** React Flow
* **Fuzzy Search:** Fuse.js
* **Icons:** Lucide React


