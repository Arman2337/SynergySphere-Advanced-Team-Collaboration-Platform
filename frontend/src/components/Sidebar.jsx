import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path fillRule={fillRule} d={path} />
  </svg>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeView, setActiveView] = useState("projects");
  const [isOpen, setIsOpen] = useState(false); // mobile toggle

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveView(params.get("view") === "tasks" ? "tasks" : "projects");
  }, [location.search]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-gray-900 px-4 py-3 border-b border-gray-800">
        <span className="text-xl font-bold text-white">SynergySphere</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white"
        >
          {/* Hamburger */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800 transform transition-transform duration-300 z-40`}
      >
        {/* Logo */}
        <div className="hidden lg:flex text-2xl font-bold text-white mb-10 items-center gap-3">
          <span className="bg-emerald-500 p-2 rounded-lg">
            <Icon
              path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z"
              fillRule="evenodd"
            />
          </span>
          <span>SynergySphere</span>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              activeView === "projects"
                ? "bg-gray-800 text-white font-semibold"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Icon
              path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6z"
              fillRule="evenodd"
            />
            <span>Projects</span>
          </Link>

          <Link
            to="/dashboard?view=tasks"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              activeView === "tasks"
                ? "bg-gray-800 text-white font-semibold"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <span>My Tasks</span>
          </Link>
        </nav>

        {/* Profile + Logout */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:bg-gray-800 rounded-lg p-1 transition-colors"
            >
              <img
                src={`https://placehold.co/40x40/1f2937/FFFFFF?text=${user?.name?.charAt(
                  0
                )?.toUpperCase()}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-700"
              />
              <div>
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H9" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
