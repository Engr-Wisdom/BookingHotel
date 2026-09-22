import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/hotels?search=${encodeURIComponent(search)}`);
    setSearch("");
    setSearchOpen(false);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearch("");
  };

  return (
    <nav
      className={`${
        isHomePage
          ? scrolled
            ? "bg-gray-800"
            : "bg-transparent"
          : "bg-gray-800"
      } fixed left-0 right-0 top-0 z-50 transition-all duration-300`}
    >
      {/* Mobile Search Mode */}
      <div
        className={`${
          searchOpen ? "flex" : "hidden"
        } h-[72px] w-full items-center gap-3 bg-gray-800 px-4 lg:hidden`}
      >
        <div className="flex flex-1 items-center gap-3 rounded-full bg-white px-4 py-2.5">

          <input
            autoFocus
            type="text"
            placeholder="Search hotels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-gray-700 outline-none"
          />
        </div>

        <button
          type="button"
          onClick={closeSearch}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-3xl text-white transition hover:bg-gray-700"
          aria-label="Close search"
        >
          ×
        </button>
      </div>

      {/* Normal Navbar */}
      <div
        className={`${
          searchOpen ? "hidden" : "flex"
        } items-center justify-between px-4 py-4 sm:px-6 lg:flex lg:px-20`}
      >
        {/* Logo */}
        <img
          src={assets.logo}
          alt="logo"
          className="w-32 cursor-pointer sm:w-40"
          onClick={() => navigateTo("/")}
        />

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 font-semibold text-white lg:flex">
          <li
            className="cursor-pointer"
            onClick={() => navigateTo("/")}
          >
            Home
          </li>

          <li
            className="cursor-pointer"
            onClick={() => navigateTo("/hotels")}
          >
            Hotels
          </li>

          <li
            className="cursor-pointer"
            onClick={() => navigateTo("/contact")}
          >
            Contact
          </li>

          <li
            className="cursor-pointer"
            onClick={() => navigateTo("/about")}
          >
            About
          </li>
        </ul>

        {/* Desktop Search */}
        <div className="hidden w-[280px] items-center gap-3 rounded-full bg-white px-4 py-2 xl:flex">
          <input
            type="text"
            placeholder="Search hotels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-gray-700 outline-none"
          />

          <img
            src={assets.searchIcon}
            alt="search"
            className="w-5 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <img
              src={assets.userIcon}
              alt="profile"
              className="w-8 cursor-pointer"
              onClick={() => navigateTo("/profile")}
            />
          ) : (
            <button
              onClick={() => navigateTo("/register")}
              className="cursor-pointer rounded-full bg-white px-5 py-2 font-semibold text-gray-800 transition hover:bg-gray-200"
            >
              Signup
            </button>
          )}

          <button
            onClick={
              user
                ? handleLogout
                : () => navigateTo("/login")
            }
            className="cursor-pointer rounded-full bg-black px-5 py-2 text-white transition hover:bg-gray-900"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Search Icon */}
          <button
            type="button"
            onClick={openSearch}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/10"
            aria-label="Search hotels"
          >
            <img
              src={assets.searchIcon}
              alt="search"
              className="w-8"
            />
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="relative z-40 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-72 bg-gray-800 px-5 pb-6 pt-24 shadow-2xl 
        transition-transform duration-300 lg:hidden ${
          menuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full 
          text-3xl text-white transition hover:bg-gray-700"
          aria-label="Close menu"
        >
          ×
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 text-white">
          <button
            onClick={() => navigateTo("/")}
            className="w-full rounded-lg px-4 text-left font-semibold transition hover:bg-gray-700"
          >
            Home
          </button>

          <button
            onClick={() => navigateTo("/hotels")}
            className="w-full rounded-lg px-4 py-3 text-left font-semibold transition hover:bg-gray-700"
          >
            Hotels
          </button>

          <button
            onClick={() => navigateTo("/contact")}
            className="w-full rounded-lg px-4 py-3 text-left font-semibold transition hover:bg-gray-700"
          >
            Contact
          </button>

          <button
            onClick={() => navigateTo("/about")}
            className="w-full rounded-lg px-4 py-3 text-left font-semibold transition hover:bg-gray-700"
          >
            About
          </button>
        </div>

        {/* Authentication */}
        <div className="mt-6 flex gap-3 border-t border-gray-700 pt-6">
          {user ? (
            <>
              <button
                onClick={() => navigateTo("/profile")}
                className="flex-1 rounded-full bg-white px-4 py-2.5 font-semibold text-gray-800 transition hover:bg-gray-200"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 rounded-full bg-black px-4 py-2.5 font-semibold text-white transition hover:bg-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo("/register")}
                className="flex-1 rounded-full bg-white px-4 py-2.5 font-semibold text-gray-800 transition hover:bg-gray-200"
              >
                Signup
              </button>

              <button
                onClick={() => navigateTo("/login")}
                className="flex-1 rounded-full bg-black px-4 py-2.5 font-semibold text-white transition hover:bg-gray-900"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;