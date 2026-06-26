import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Network, Moon, Sun, Key, LogOut, CheckCircle } from "lucide-react";
import { useApp } from "../../lib/AppContext";

export const Navbar: React.FC = () => {
  const { settings, isAdmin, login, logout } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Dark/Light toggle
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passcode);
    if (success) {
      setLoginError(false);
      setPasscode("");
      setShowLoginModal(false);
      navigate("/admin");
    } else {
      setLoginError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand/Title */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs select-none shadow-sm">
                VB
              </div>
              <span className="text-xl font-semibold font-sans tracking-tight text-zinc-800 dark:text-white">
                {settings.title || "Vaibhav's Brain"}
              </span>
            </Link>
            
            {/* Minimal section links for quick access */}
            <span className="hidden md:inline text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {settings.tagline || "digital garden & notebook"}
            </span>
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              to="/search"
              aria-label="Search"
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ${
                location.pathname === "/search" ? "text-indigo-500" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Mind Map / Graph */}
            <Link
              to="/graph"
              aria-label="Mind Map Graph"
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ${
                location.pathname === "/graph" ? "text-indigo-500" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Network className="h-5 w-5" />
            </Link>

            {/* Dark Mode Theme Control */}
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Admin trigger & state */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:opacity-90 border border-indigo-100 dark:border-indigo-900"
                >
                  <CheckCircle className="h-3 w-3" />
                  Admin Active
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  aria-label="Sign out of Admin Dashboard"
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Admin Secret Passcode Trigger Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-indigo-500 text-white">
                <Key className="h-5 w-5" />
              </div>
              <div>
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
                  <p className="text-xs text-red-500 mt-1.5">Passcode key is invalid. Try again.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 text-sm pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPasscode("");
                    setLoginError(false);
                  }}
                  className="px-4 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
