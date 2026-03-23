"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Globe, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#041e49] text-white mt-16 ">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Maple Learning"
            width={160}
            height={56}
            className="object-contain"
          />
        </div>

        {/* Legal Links */}
        <div className="flex gap-6 text-sm">
          <Link
            href="https://www.maplelearningsolutions.com/terms-conditions"
            target="_blank"
            className="hover:text-[#d7b55b] transition"
          >
            Terms & Conditions
          </Link>
          <Link
            href="https://www.maplelearningsolutions.com/privacy-policy"
            target="_blank"
            className="hover:text-[#d7b55b] transition"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5">
          <Link href="https://www.linkedin.com/company/maple-learning-solutions" target="_blank" className="hover:text-[#d7b55b] transition">
            <Linkedin size={20} />
          </Link>
          <Link href="https://www.maplelearningsolutions.com" target="_blank" className="hover:text-[#d7b55b] transition">
            <Globe size={20} />
          </Link>
          <Link href="https://www.facebook.com/people/Maple-Learning-Solutions/61578896339989/" target="_blank" className="hover:text-[#d7b55b] transition">
            <Facebook size={20} />
          </Link>
          <Link href="https://www.instagram.com/maple_learning_solutions" target="_blank" className="hover:text-[#d7b55b] transition">
            <Instagram size={20} />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 text-center text-xs py-4">
        © {new Date().getFullYear()} Maple Learning Solutions. All rights reserved.
      </div>
    </footer>
  );
}
