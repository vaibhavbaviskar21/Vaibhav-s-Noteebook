import React, { createContext, useContext, useState, useEffect } from "react";
import { Section, Folder, Post, SiteSettings } from "../types";
import {
  getSections,
  getFolders,
  getPosts,
  getSiteSettings,
  seedDatabase,
  saveSection,
  deleteSection,
  saveFolder,
  deleteFolder,
  savePost,
  deletePost,
  saveSiteSettings,
} from "./supabase";
import { checkAndPublish } from "./scheduler";
import { buildSearchIndex } from "./search";

interface AppContextProps {
  sections: Section[];
  folders: Folder[];
  posts: Post[];
  settings: SiteSettings;
  isAdmin: boolean;
  isLoading: boolean;
  login: (secret: string) => boolean;
  logout: () => void;
  refreshData: () => Promise<void>;
  
  // State mutations
  addOrUpdateSection: (section: Section) => Promise<void>;
  removeSection: (id: string) => Promise<void>;
  addOrUpdateFolder: (folder: Folder) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  addOrUpdatePost: (post: Post) => Promise<void>;
  removePost: (id: string) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ id: "site", title: "Vaibhav's Brain", tagline: "" });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const ADMIN_SECRET = (import.meta as any).env.VITE_ADMIN_SECRET || "admin123";

  // Check login state on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin_session");
    if (saved === ADMIN_SECRET) {
      setIsAdmin(true);
    }
  }, [ADMIN_SECRET]);

  // Initial load
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      // Ensure seed runs if DB is empty
      await seedDatabase();

      // Fetch
      const [secList, folList, pstList, siteConf] = await Promise.all([
        getSections(),
        getFolders(),
        getPosts(),
        getSiteSettings(),
      ]);

      // Filter and run publishing check
      const didPublishAny = await checkAndPublish(pstList);
      let latestPosts = pstList;
      if (didPublishAny) {
        latestPosts = await getPosts();
      }

      setSections(secList || []);
      setFolders(folList || []);
      setPosts(latestPosts || []);
      setSettings(siteConf);

      // Create fuzzy index
      buildSearchIndex(latestPosts || []);
    } catch (err) {
      console.error("Critical error loading ecosystem details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const login = (secret: string): boolean => {
    if (secret === ADMIN_SECRET) {
      localStorage.setItem("admin_session", secret);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin_session");
    setIsAdmin(false);
  };

  const addOrUpdateSection = async (section: Section) => {
    await saveSection(section);
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === section.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = section;
        return copy.sort((a, b) => a.order - b.order);
      }
      return [...prev, section].sort((a, b) => a.order - b.order);
    });
  };

  const removeSection = async (id: string) => {
    await deleteSection(id);
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const addOrUpdateFolder = async (folder: Folder) => {
    await saveFolder(folder);
    setFolders((prev) => {
      const idx = prev.findIndex((f) => f.id === folder.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = folder;
        return copy.sort((a, b) => a.order - b.order);
      }
      return [...prev, folder].sort((a, b) => a.order - b.order);
    });
  };

  const removeFolder = async (id: string) => {
    await deleteFolder(id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  const addOrUpdatePost = async (post: Post) => {
    await savePost(post);
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === post.id);
      let updatedList = [...prev];
      if (idx > -1) {
        updatedList[idx] = post;
      } else {
        updatedList.push(post);
      }
      buildSearchIndex(updatedList);
      return updatedList;
    });
  };

  const removePost = async (id: string) => {
    await deletePost(id);
    setPosts((prev) => {
      const updatedList = prev.filter((p) => p.id !== id);
      buildSearchIndex(updatedList);
      return updatedList;
    });
  };

  const updateSiteSettings = async (nextSettings: SiteSettings) => {
    await saveSiteSettings(nextSettings);
    setSettings(nextSettings);
  };

  const forceSeedDatabase = async () => {
    await seedDatabase(true); // force re-seed
    await loadAllData();
  };

  return (
    <AppContext.Provider
      value={{
        sections,
        folders,
        posts,
        settings,
        isAdmin,
        isLoading,
        login,
        logout,
        refreshData: loadAllData,
        addOrUpdateSection,
        removeSection,
        addOrUpdateFolder,
        removeFolder,
        addOrUpdatePost,
        removePost,
        updateSiteSettings,
        seedDatabase: forceSeedDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
};
