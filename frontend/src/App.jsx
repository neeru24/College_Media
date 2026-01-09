import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

/* ===== Pages ===== */
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgetPassword";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Trending from "./pages/Trending";
import Explore from "./pages/Explore";
import Stories from "./pages/Stories";
import CreateStory from "./pages/CreateStory";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Reels from "./pages/Reels";
import CreatePost from "./pages/CreatePost";
import ContactUs from "./pages/ContactUs";
import GamifiedAssessmentPage from "./pages/GamifiedAssessmentPage";
import AdvancedSyllabusPage from "./pages/AdvancedSyllabusPage";
import CertificatePage from "./pages/CertificatePage";

/* ===== Components ===== */
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import LeftSidebar from "./components/LeftSidebar";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import ProfileEditForm from "./components/Auth/ProfileEditForm";

/* ================= CURSOR TRAIL (ADDED ONLY) ================= */
const CursorTrail = () => {
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "rgba(34,197,94,0.8)",
        boxShadow: "0 0 20px rgba(34,197,94,0.8)",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />
  );
};
/* ============================================================ */

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Feed");

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <CursorTrail />
          <AppContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent = ({ searchQuery, setSearchQuery, activeTab, setActiveTab }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/home")) setActiveTab("Feed");
    else if (location.pathname.startsWith("/trending")) setActiveTab("Trending");
    else if (location.pathname.startsWith("/explore")) setActiveTab("Explore");
    else if (location.pathname.startsWith("/stories")) setActiveTab("Stories");
    else if (location.pathname.startsWith("/reels")) setActiveTab("Reels");
    else if (location.pathname.startsWith("/messages")) setActiveTab("Messages");
    else if (location.pathname.startsWith("/profile")) setActiveTab("Profile");
    else if (location.pathname.startsWith("/settings")) setActiveTab("Settings");
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        element={
          <Layout
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEditForm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Route>

      <Route path="/contact" element={<ContactUs />} />
      <Route path="/certificate" element={<CertificatePage />} />
      <Route path="/assessment" element={<GamifiedAssessmentPage />} />
      <Route path="/advanced-syllabus" element={<AdvancedSyllabusPage />} />
    </Routes>
  );
};

export default App;
