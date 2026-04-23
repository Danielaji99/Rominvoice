import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./Sidebar.css";

const LogoIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.04612 1.81859C2.83609 4.19645 0 8.66703 0 13.7901C0 21.4062 6.26801 27.5803 14 27.5803C21.732 27.5803 28 21.4062 28 13.7901C28 8.66703 25.1639 4.19645 20.9539 1.81859L14.4463 14.705L14 15.5888L13.5537 14.705L7.04612 1.81859ZM7.93386 1.3581C9.76913 0.487636 11.8267 -0.000135779 14 -0.000135779C16.1733 -0.000135779 18.2309 0.487636 20.0661 1.3581L14 13.3704L7.93386 1.3581Z"
      fill="white"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10"
      cy="10"
      r="4"
      stroke="#858BB2"
      strokeWidth="1.5"
      fill="none"
    />
    <g stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round">
      <line x1="10" y1="1" x2="10" y2="3" />
      <line x1="10" y1="17" x2="10" y2="19" />
      <line x1="1" y1="10" x2="3" y2="10" />
      <line x1="17" y1="10" x2="19" y2="10" />
      <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" />
      <line x1="15.54" y1="15.54" x2="16.95" y2="16.95" />
      <line x1="3.05" y1="16.95" x2="4.46" y2="15.54" />
      <line x1="15.54" y1="4.46" x2="16.95" y2="3.05" />
    </g>
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.502 1.794A8.5 8.5 0 1018.206 10.5c-1.506.918-3.26 1.45-5.144 1.45a9.5 9.5 0 01-9.5-9.5c0-.902.127-1.775.365-2.6a8.477 8.477 0 015.575 1.944z"
      stroke="#858BB2"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar__logo" aria-label="Invoice App">
        <div className="sidebar__logo-bg">
          <LogoIcon />
        </div>
      </div>

      {/* Bottom section: theme toggle + avatar */}
      <div className="sidebar__bottom">
        <button
          className="sidebar__theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="sidebar__divider" aria-hidden="true" />

        <div className="sidebar__avatar" aria-label="User profile">
          <img
            src="https://https://i.pinimg.com/736x/56/db/61/56db615462081cb6ae73dbe22e03df5f.jpg.pravatar.cc/40?img=12"
            alt="User avatar"
            width={40}
            height={40}
          />
        </div>
      </div>
    </aside>
  );
}
