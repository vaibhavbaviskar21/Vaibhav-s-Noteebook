import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Eye, CheckCircle, RotateCw, Settings, Database, MessageSquare } from "lucide-react";
import { useApp } from "../../lib/AppContext";
import { SiteSettings } from "../../types";

export const SettingsManager: React.FC = () => {
  const { settings, updateSiteSettings, seedDatabase, isAdmin, isLoading } = useApp();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state values with settings
  useEffect(() => {
    if (settings) {
      setTitle(settings.title || "Vaibhav's Brain");
      setTagline(settings.tagline || "Where personal notebooks meet a streamlined blogging digital garden.");
      setBio(settings.bio || "Sovereign knowledge backplane tracking computer science, research, project logs, and CTFs.");
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("A site title is required.");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSiteSettings({
        id: "global",
        title: title.trim(),
        tagline: tagline.trim(),
        bio: bio.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Failed to write general site parameters.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm("Are you sure you want to seed default template notebooks? This will load example topics inside all section folders so you can inspect layouts easily during previews.")) return;
    setIsSeeding(true);
    try {
      await seedDatabase();
      alert("Digital garden loaded with default notebooks successfully!");
    } catch (err) {
      alert("Seeding process failed.");
    } finally {
      setIsSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Opening Admin Settings...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-sm py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-808 dark:text-white">Admin Clearance Required</h2>
        <Link to="/" className="text-xs text-indigo-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none animate-fade-in">
      
      {/* Title block */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-850 pb-5">
        <Link
          to="/admin"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Garden Calibration</h1>
          <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-widest font-bold">Configure metadata properties and persistence parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* SETTINGS FIELDS FORM */}
        <form onSubmit={handleSaveSettings} className="md:col-span-2 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/10 shadow-sm space-y-5">
          <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-505 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-indigo-500" />
            <span>General Properties</span>
          </h3>

          <div className="space-y-4 font-sans text-xs">
            {/* Title field */}
            <div className="space-y-1">
              <label className="font-bold text-zinc-500 block">Site Title</label>
              <input
                type="text"
                placeholder="Vaibhav's Brain"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Tagline field */}
            <div className="space-y-1">
              <label className="font-bold text-zinc-500 block">Tageline summary statement</label>
              <input
                type="text"
                placeholder="Where personal notebooks meet a streamlined blogging digital garden."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Biography field */}
            <div className="space-y-1">
              <label className="font-bold text-zinc-500 block">Lead Author Biography</label>
              <textarea
                placeholder="Brief summary displaying at footers..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-indigo-550 resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-600 shadow transition cursor-pointer disabled:opacity-40"
            >
              {isSaving ? <RotateCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save settings</span>
            </button>
          </div>
        </form>

        {/* UTILITIES RIGHT COLUMN SIDEBAR */}
        <div className="space-y-6">
          
          {/* Seeding Controls Box */}
          <div className="border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/10 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-505 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-[#10b981]" />
              <span>Diagnostic Seeding</span>
            </h3>

            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed font-sans">
              Is your workspace empty? Instantly populate the Digital Garden with structured folders, DSA trees, CTF code, and related links. This builds the connections needed to test the graph view right away.
            </p>

            <button
              type="button"
              onClick={handleSeedData}
              disabled={isSeeding}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#10b981] text-[#10b981] hover:bg-[#10b981]/5 hover:border-[#10b981] font-bold text-xs shadow-sm transition-all cursor-pointer bg-transparent disabled:opacity-50"
            >
              {isSeeding ? <RotateCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              <span>Populate Digital Garden</span>
            </button>
          </div>

          {/* Tips cards panel */}
          <div className="p-4.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-850 font-sans text-xs text-zinc-500 dark:text-zinc-400 space-y-2.5">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>Workspace Calibration</span>
            </h4>
            <ul className="space-y-2 font-serif italic list-disc pl-4 text-[11px] leading-relaxed">
              <li>Changes to title, tagline, and tagline bios are immediate.</li>
              <li>Always seed template databases when booting this workspace for the first time.</li>
              <li>Site SEO maps read values entered here for OpenGraph cards.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
