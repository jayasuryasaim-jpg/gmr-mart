"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Availability", href: "/availability" },
  { name: "Smart Cart", href: "/smart-cart" },
  { name: "Buy & Collect", href: "/buy-collect" },
  { name: "Crowd", href: "/crowd" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
            <ShoppingCart size={22} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              GMR SMART MART
            </h1>

            <p className="text-xs text-gray-500">
              Smart Retail Ecosystem
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-emerald-500 hover:text-emerald-600">
            Login
          </button>

          <button className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:scale-105 hover:bg-emerald-600">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 lg:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 bg-white px-6 py-6 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-3">
                <button className="rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700">
                  Login
                </button>

                <button className="rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white">
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}