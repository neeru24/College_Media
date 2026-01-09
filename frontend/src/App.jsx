import { useState, useEffect, lazy, Suspense, useRef } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LeftSidebar from "./components/LeftSidebar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ErrorProvider } from "./context/ErrorContext.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { PostSkeleton } from "./components/SkeletonLoader.jsx";
import { useWebVitals, reportWebVitals } from "./hooks/useWebVitals.js";
import { performanceMonitor } from "./utils/performanceMonitor.js";
import BackButton from "./components/BackButton.jsx";
import InstallPWA from "./components/InstallPWA.jsx";
import OfflineIndicator from "./components/OfflineIndicator.jsx";

// Lazy load route components for code splitting
const Reels = lazy(() => import("./pages/Reels.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.jsx"));
const CertificatePage = lazy(() => import("./pages/CertificatePage.jsx"));
const GamifiedAssessmentPage = lazy(() =>
  import("./pages/GamifiedAssessmentPage.jsx")
);
const AdvancedSyllabusPage = lazy(() =>
  import("./pages/AdvancedSyllabusPage.jsx")
);
const Home = lazy(() => import("./pages/Home.jsx"));
const CreatePost = lazy(() => import("./components/CreatePost.jsx"));
const CoursesLanding = lazy(() => import("./pages/CoursesLanding.jsx"));
const LearningMode = lazy(() => import("./pages/LearningMode.jsx"));
const Landing = lazy(() => import("./pages/Landing.jsx"));
const NotificationCenter = lazy(() => import("./components/NotificationCenter.jsx"));
const NotificationPreferences = lazy(() => import("./components/NotificationPreferences.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));

/* ================= CURSOR TRAIL (ADDED ONLY) ================= */
const CursorTrail = () => {
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "rgba(34,197,94,0.85)",
        boxShadow: "0 0 16px rgba(34,197,94,0.9)",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />
  );
};
/* =========================================================== */

const MainLayout = ({
  children,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav
        className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <div className="w-24 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-300">
                <span className="text-white font-bold text-xl">InstaClone</span>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <label htmlFor="main-search" className="sr-only">
                  Search posts and users
                </label>
                <input
                  id="main-search"
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 focus:bg-white dark:focus:bg-slate-700 transition-all duration-300"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1" aria-label="Sidebar navigation">
            <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </aside>
          <main id="main-content" className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [likedPosts, setLikedPosts] = useState({});
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");

  useWebVitals(reportWebVitals);

  useEffect(() => {
    performanceMonitor.mark("app-init");

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/serviceWorker.js");
    }

    window.addEventListener("load", () => {
      performanceMonitor.mark("app-loaded");
      performanceMonitor.measure("app-load-time", "app-init", "app-loaded");
      performanceMonitor.report();
    });
  }, []);

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <CursorTrail />

        <Toaster position="top-right" />
        <BackButton />

        <Routes>
          <Route
            path="/*"
            element={
              <MainLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <Suspense fallback={<PostSkeleton />}>
                  <Home />
                </Suspense>
              </MainLayout>
            }
          />
        </Routes>

        <InstallPWA />
        <OfflineIndicator />
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default App;
