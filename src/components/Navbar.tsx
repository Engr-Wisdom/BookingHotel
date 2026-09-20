import { assets } from "../assets/assets";

import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import type { KeyboardEvent } from "react";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const { user, logout } = useAuth();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        setScrolled(window.scrollY > 50);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/hotels?search=${encodeURIComponent(search)}`);

    setSearch("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <nav
      className={`

        ${
          isHomePage
            ? scrolled
              ? "bg-gray-800"
              : "bg-transparent"
            : "bg-gray-800"
        }

        fixed

        top-0

        left-0

        right-0

        z-50

        flex

        items-center

        justify-between

        px-6

        py-4

        lg:px-20

        transition-all

        duration-300

      `}
    >
      {/* Logo */}

      <img
        src={assets.logo}
        alt="logo"
        className="w-40 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Navigation Links */}

      <ul
        className="

          hidden

          lg:flex

          gap-8

          font-semibold

          text-white

        "
      >
        <li className="cursor-pointer" onClick={() => navigate("/")}>
          Home
        </li>

        <li className="cursor-pointer" onClick={() => navigate("/hotels")}>
          Hotels
        </li>

        <li className="cursor-pointer" onClick={() => navigate("/contact")}>
          Contact
        </li>

        <li className="cursor-pointer" onClick={() => navigate("/about")}>
          About
        </li>
      </ul>

      {/* Search Bar */}

      <div
        className="

          hidden

          xl:flex

          items-center

          gap-3

          bg-white

          rounded-full

          px-4

          py-2

          w-[300px]

        "
      >
        <input
          type="text"
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="

            w-full

            outline-none

            text-gray-700

          "
        />

        <img
          src={assets.searchIcon}
          alt="search"
          className="

            w-5

            cursor-pointer

          "
          onClick={handleSearch}
        />
      </div>

      {/* Authentication Section */}

      <div
        className="

          flex

          items-center

          gap-5

        "
      >
        {/* If logged in show profile icon */}

        {user ? (
          <img
            src={assets.userIcon}
            alt="profile"
            className="

              w-8

              cursor-pointer

            "
            onClick={() => navigate("/profile")}
          />
        ) : (
          // If not logged in show signup button

          <button
            onClick={() => navigate("/register")}
            className="

              bg-white

              text-gray-800

              px-6

              py-2

              rounded-full

              font-semibold

              cursor-pointer

              hover:bg-gray-200

              transition

            "
          >
            Signup
          </button>
        )}

        {/* Login / Logout */}

        <button
          onClick={user ? handleLogout : () => navigate("/login")}
          className="

            bg-black

            text-white

            px-6

            py-2

            rounded-full

            cursor-pointer

            hover:bg-gray-900

            transition

          "
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
