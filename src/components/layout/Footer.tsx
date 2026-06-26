import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../lib/AppContext";
import { Key } from "lucide-react";

export const Footer: React.FC = () => {
  const { sections, settings, isAdmin, login } = useApp();
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passcode);
    if (success) {
      setLoginError(false);
      setPasscode("");
      setShowModal(false);
      navigate("/admin");
    } else {
      setLoginError(true);
    }
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <div>
          © {year} <span className="font-semibold">{settings.title || "Vaibhav's Brain"}</span>. All rights reserved
          {/* Secret administrative entry point dot */}
          {!isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="text-zinc-300 dark:text-zinc-800 hover:text-zinc-500 dark:hover:text-zinc-500 cursor-pointer focus:outline-none ml-0.5 select-none transition-colors"
              title="Portal"
            >
              .
            </button>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-indigo-500 hover:underline font-bold ml-2"
            >
              (Workspace Active)
            </Link>
          )}
        </div>
        
        {/* Section links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {sections.map((sec) => (
            <Link
              key={sec.id}
              to={`/${sec.slug}`}
              className="hover:text-indigo-500 hover:underline transition-all flex items-center gap-1"
            >
              <span>{sec.icon}</span>
              <span>{sec.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Secret Passcode modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-sans">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-indigo-500 text-white">
                <Key className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Unlock Admin Workspace</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Enter secret passcode key to gain write access</p>
              </div>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Passcode Key"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:outline-none dark:focus:border-indigo-500"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-red-500 mt-1.5 text-left">Passcode key is invalid. Try again.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 text-sm pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPasscode("");
                    setLoginError(false);
                  }}
                  className="px-4 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition cursor-pointer"
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};
