import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./lib/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Page Views
import { Home } from "./pages/Home";
import { SectionDetail } from "./pages/SectionDetail";
import { PostDetail } from "./pages/PostDetail";
import { GraphView } from "./pages/GraphView";
import { SearchView } from "./pages/SearchView";

// Admin Views
import { Dashboard } from "./pages/admin/Dashboard";
import { PostEditor } from "./pages/admin/PostEditor";
import { FoldersManager } from "./pages/admin/FoldersManager";
import { SettingsManager } from "./pages/admin/SettingsManager";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Views */}
              <Route path="/" element={<Home />} />
              <Route path="/graph" element={<GraphView />} />
              <Route path="/search" element={<SearchView />} />
              
              {/* Admin Views */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/editor/new" element={<PostEditor />} />
              <Route path="/admin/editor/:postId" element={<PostEditor />} />
              <Route path="/admin/folders" element={<FoldersManager />} />
              <Route path="/admin/settings" element={<SettingsManager />} />

              {/* Dynamic Sections and Posts Routing */}
              <Route path="/:sectionSlug" element={<SectionDetail />} />
              <Route path="/:sectionSlug/:postSlug" element={<PostDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
