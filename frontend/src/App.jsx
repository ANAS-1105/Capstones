import React, { useState, useEffect } from "react";
import { 
  Brain, LayoutDashboard, BarChart3, Award, LogOut, Sun, Moon, 
  Menu, X, Lock, Mail, User, ShieldAlert, Info 
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Badges from "./components/Badges";
import About from "./components/About";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth Form State
  const [isRegister, setIsRegister] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const API_URL = `http://${window.location.hostname}:8000/api`;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Fetch Current User Profile
  const fetchProfile = async (authToken) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token expired
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  // Handle Authentication (Register / Login)
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword || (isRegister && !authName)) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }
    setAuthLoading(true);

    try {
      if (isRegister) {
        // Register Flow
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: authName, email: authEmail, password: authPassword })
        });
        if (res.ok) {
          showNotification("Registration successful! Logging you in...", "success");
          // Immediately login
          await performLogin(authEmail, authPassword);
        } else {
          const errData = await res.json();
          showNotification(errData.detail || "Registration failed", "error");
        }
      } else {
        // Login Flow
        await performLogin(authEmail, authPassword);
      }
    } catch (err) {
      showNotification("Could not communicate with the authentication server.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const performLogin = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      showNotification("Welcome back to MindMentor AI!", "success");
      // Clear forms
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
    } else {
      const errData = await res.json();
      showNotification(errData.detail || "Invalid login credentials", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setActiveView("dashboard");
    showNotification("Logged out successfully.", "info");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition duration-300 relative overflow-hidden flex flex-col">
      
      {/* Decorative Blur Background Blobs (Only shown in Dark Mode for high contrast) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full hidden dark:block bg-primary-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full hidden dark:block bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl border shadow-lg flex items-center gap-3 animate-bounce transition-all ${
          notification.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900"
            : notification.type === "error"
            ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900"
            : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900"
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            notification.type === "success" ? "bg-emerald-500" : notification.type === "error" ? "bg-rose-500" : "bg-blue-500"
          }`} />
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {!token ? (
        /* --- AUTHENTICATION WALL --- */
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md glass-card rounded-3xl p-8 border shadow-xl space-y-6">
            
            {/* Logo Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                <Brain className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black font-outfit text-gray-900 dark:text-white mt-3">
                MindMentor AI
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "Helping students learn smarter by understanding how they feel."
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isRegister && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 pl-10 pr-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 pl-10 pr-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 pl-10 pr-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-sky-500 hover:from-primary-600 hover:to-sky-600 text-white font-bold text-sm shadow-md shadow-primary-500/10 hover:shadow-primary-600/20 transition disabled:opacity-50"
              >
                {authLoading ? "Verifying..." : isRegister ? "Create Account" : "Access Workspace"}
              </button>
            </form>

            {/* Toggle Form Type */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition"
              >
                {isRegister ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
            
            {/* Theme toggle on Auth Screen */}
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* --- CORE APP DASHBOARD --- */
        <>
          {/* Header Navigation */}
          <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-900/80 transition duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary-500 text-white shadow-md shadow-primary-500/20">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight font-outfit text-gray-900 dark:text-white">
                    MindMentor AI
                  </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                      activeView === "dashboard"
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveView("analytics")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                      activeView === "analytics"
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveView("badges")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                      activeView === "badges"
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    Badges
                  </button>
                  <button
                    onClick={() => setActiveView("about")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                      activeView === "about"
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    About
                  </button>
                </nav>

                {/* Right controls */}
                <div className="hidden md:flex items-center gap-3">
                  {user && (
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-900 dark:text-gray-400 px-3 py-1.5 rounded-full">
                      Hi, {user.name}
                    </span>
                  )}
                  
                  {/* Theme Toggle */}
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-xl text-gray-500"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-xl text-gray-500"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>

              </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 bg-white dark:bg-gray-950 px-4 py-3 space-y-1">
                <button
                  onClick={() => { setActiveView("dashboard"); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-400" />
                  Dashboard
                </button>
                <button
                  onClick={() => { setActiveView("analytics"); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  Analytics
                </button>
                 <button
                  onClick={() => { setActiveView("badges"); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <Award className="w-5 h-5 text-gray-400" />
                  Badges
                </button>
                <button
                  onClick={() => { setActiveView("about"); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <Info className="w-5 h-5 text-gray-400" />
                  About
                </button>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            )}
          </header>

          {/* Main App Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
             {activeView === "dashboard" && <Dashboard token={token} showNotification={showNotification} />}
            {activeView === "analytics" && <Analytics token={token} showNotification={showNotification} />}
            {activeView === "badges" && <Badges token={token} showNotification={showNotification} />}
            {activeView === "about" && <About />}
          </main>

          {/* Footer */}
          <footer className="py-6 border-t border-gray-100/50 dark:border-gray-900/50 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} MindMentor AI. Designed with empathy for student wellness.
          </footer>
        </>
      )}

    </div>
  );
}
