"use client";

import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 px-6 py-8 bg-white/5 backdrop-blur-md border-t border-white/10 text-gray-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo / Title */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-white tracking-wide">GitWise</h1>
          <p className="text-sm text-gray-400">Decode GitHub faster</p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-8 text-sm text-gray-300">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/features" className="hover:text-white transition">Features</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <Github size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <Twitter size={20} />
          </a>
          <a href="mailto:hello@gitwise.dev" className="hover:text-white">
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className="mt-6 text-xs text-center text-gray-500">
        © {new Date().getFullYear()} GitWise. All rights reserved.
      </div>
    </footer>
  );
}
