// app/Footer.tsx
"use client";

import Link from "next/link";
import { Github, Mail, Phone, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-950 text-slate-300">
      {/* Top: content */}
      <div className="mx-auto w-full max-w-7xl px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h4 className="text-white text-xl font-bold tracking-tight">TRIPPLANNER</h4>
          <p className="mt-3 text-slate-400 leading-relaxed">
            이 사이트는 취업 준비를 위한 개인 프로젝트 입니다.
          </p>

          {/* Socials */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://github.com/JKJ0918/trip-planner-frontend"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub 저장소 열기"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <Github className="size-5" />
            </a>
            <a
              href="mailto:whrjswo123@naver.com"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
              aria-label="이메일 보내기"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="바로가기">
          <h4 className="text-white font-semibold mb-3">바로가기</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                이용약관 <ExternalLink className="size-4 opacity-60" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                개인정보처리방침 <ExternalLink className="size-4 opacity-60" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                자주 묻는 질문 <ExternalLink className="size-4 opacity-60" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
              >
                서비스 소개 <ExternalLink className="size-4 opacity-60" />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">문의</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              이메일:{" "}
              <a href="mailto:whrjswo123@naver.com" className="hover:text-white underline underline-offset-4">
                whrjswo123@naver.com
              </a>
            </li>
            <li>
              전화:{" "}
              <a href="tel:01012345678" className="hover:text-white">
                010-1234-5678
              </a>
            </li>
            <li className="break-all">
              GitHub:{" "}
              <a
                href="https://github.com/JKJ0918/trip-planner-frontend"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white underline underline-offset-4"
              >
                https://github.com/JKJ0918/trip-planner-frontend
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            © 2025 TripPlanner. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with Next.js, TypeScript, Tailwind CSS, Spring Boot, and Google Maps Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
