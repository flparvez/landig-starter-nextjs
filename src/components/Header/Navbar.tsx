"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart"; 

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Landing", href: "/landing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cart } = useCart(); // <-- get cart from useCart

  // Calculate total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="w-full bg-white shadow-sm border-b border-gray-200 fixed z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Logo & Cart */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold text-xl text-gray-700 tracking-wide select-none">
              ShopLand
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-1">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="mx-1 px-3 py-2 rounded text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Searchbar (desktop) */}
          <div className="hidden lg:flex items-center min-w-[240px] ml-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Add search logic here
              }}
              className="relative w-full"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full text-sm bg-gray-50"
              />
              <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" strokeWidth={2} />
            </form>
          </div>

          {/* Cart Icon */}
          <div className="ml-4 flex items-center">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-7 h-7 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Hamburger */}
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {menuOpen ? (
                <X className="w-7 h-7" strokeWidth={2.25} />
              ) : (
                <Menu className="w-7 h-7" strokeWidth={2.25} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? "max-h-[700px] py-3" : "max-h-0 py-0"
          }`}
          style={{ boxShadow: menuOpen ? "0 2px 10px 0 rgba(0,0,0,0.05)" : undefined }}
        >
          <div className="px-5 pb-2 pt-1 space-y-1">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="block px-3 py-2 rounded text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* Searchbar (mobile) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                // Optionally trigger search here
              }}
              className="relative mt-2"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500 bg-gray-50 text-sm"
              />
              <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" strokeWidth={2} />
            </form>
          </div>
        </div>
      </nav>
      {/* Spacer for navbar height */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
