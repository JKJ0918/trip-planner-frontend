"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Join } from "./utils/join";
import Modal from "./components/Modal";
import TermsContent from "./components/TermsContent";
import PrivacyContent from "./components/PrivacyContent";
import { allPassed, checkPassword } from "./utils/passwordRules";
import PasswordRules from "./components/PasswordRules";
import { usernameCheck } from "./utils/usernameCheck";
import { nicknameCheck } from "./utils/nicknameCheck";

export default function JoinPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");   // First + Last → Name 하나로 통일
  const [email, setEmail] = useState("");

  // 약관 모달
  const [open, setOpen] = useState<null | "terms" | "privacy">(null);
  const openTerms = () => setOpen("terms");
  const openPrivacy = () => setOpen("privacy");
  const close = () => setOpen(null);

  // 비밀번호 유효성검사
  const pwCheck = checkPassword(password, confirmPassword);

  // 아이디(username) 유효성검사
  const [uStatus, setUStatus] = useState<"idle"|"checking"|"ok"|"taken"|"error">("idle");
  const [uMsg, setUMsg] = useState<string>("");

  // 닉네임(nickname) 유효성검사
  const [nStatus, setNStatus] = useState<"idle"|"checking"|"ok"|"taken"|"error">("idle");
  const [nMsg, setNMsg] = useState<string>("");

  // 제출 버튼 (유효성 검사)
  const canSubmit = allPassed(pwCheck) && uStatus === "ok" && nStatus === "ok"&&  email && name;


  const handleJoin = async () => {
    if (!username || !password || !email || !name) {
      alert("필수 항목을 입력해 주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const success = await Join(username, password, nickname, name, email);
    if (success) {
      router.push("/login");
    }
  };

  // 아이디(username) 유효성검사 코드
  async function handleCheckUsername() {
    if(!username){
        return;
    }
    setUStatus("checking");
    setUMsg("");
    
    try {
        const { available, message } = await usernameCheck(username.trim());
        if(available){
            setUStatus("ok");
            setUMsg(message ?? "사용 가능한 아이디입니다.");
        } else {
            setUStatus("taken");
            setUMsg(message ?? "이미 사용 중인 아이디입니다.");
        }
    } catch (e) {
        setUStatus("error");
        setUMsg("확인 중 오류가 발생했습니다.");
    }

  }

  // 닉네임 (nickname) 유효성검사 코드
  async function handleCheckNickname() {
    if(!nickname){
        return;
    }
    setNStatus("checking");
    setNMsg("");
    
    try {
        const { available, message } = await nicknameCheck(nickname.trim());
        if(available){
            setNStatus("ok");
            setNMsg(message ?? "사용 가능한 닉네임입니다.");
        } else {
            setNStatus("taken");
            setNMsg(message ?? "이미 사용 중인 닉네임입니다.");
        }
    } catch (e) {
        setNStatus("error");
        setNMsg("확인 중 오류가 발생했습니다.");
    }

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* 상단 로고 + 타이틀 */}
      <div className="text-center mb-6">
        <img src="images/logo.png" alt="TripPlanner" className="mx-auto h-10 w-auto" />
        <h1 className="mt-4 text-slate-600">Sign up into your account</h1>
      </div>

      {/* 회원가입 카드 */}
      <div className="w-full max-w-3xl">
        <div className="rounded-xl border border-slate-200 p-8 shadow-[0_2px_22px_-4px_rgba(93,96,127,0.08)]">
          {/* 폼 */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-slate-800 mb-1.5">
                이름
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="h-11 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-slate-800 mb-1.5">아이디</label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="Enter username"
                    className={`h-11 flex-1 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2
                        ${uStatus === "ok" ? "focus:ring-green-500" :
                        uStatus === "taken" || uStatus === "error" ? "focus:ring-red-500" :
                        "focus:ring-blue-500"}`}
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setUStatus("idle"); setUMsg(""); }}
                    />
                    <button
                    type="button"
                    onClick={handleCheckUsername}
                    disabled={!username || uStatus === "checking"}
                    className={`h-11 shrink-0 rounded-lg border px-3 text-sm font-medium
                        ${uStatus === "checking" ? "bg-gray-100 text-gray-500 cursor-wait" : "hover:bg-gray-50"}`}
                    >
                    {uStatus === "checking" ? "확인중..." : "중복검사"}
                    </button>
                </div>
                {uMsg && (
                    <p className={`mt-1 text-xs ${
                    uStatus === "ok" ? "text-green-600" :
                    uStatus === "taken" || uStatus === "error" ? "text-red-600" : "text-gray-500"
                    }`}>
                    {uMsg}
                    </p>
                )}
            </div>

            {/* Nickname */}
            <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-slate-800 mb-1.5">닉네임</label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="Enter nickname"
                    className={`h-11 flex-1 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2
                        ${nStatus === "ok" ? "focus:ring-green-500" :
                        nStatus === "taken" || nStatus === "error" ? "focus:ring-red-500" :
                        "focus:ring-blue-500"}`}
                    value={nickname}
                    onChange={(e) => { setNickname(e.target.value); setNStatus("idle"); setNMsg(""); }}
                    />
                    <button
                    type="button"
                    onClick={handleCheckNickname}
                    disabled={!nickname || nStatus === "checking"}
                    className={`h-11 shrink-0 rounded-lg border px-3 text-sm font-medium
                        ${nStatus === "checking" ? "bg-gray-100 text-gray-500 cursor-wait" : "hover:bg-gray-50"}`}
                    >
                    {nStatus === "checking" ? "확인중..." : "중복검사"}
                    </button>
                </div>
                {nMsg && (
                    <p className={`mt-1 text-xs ${
                    nStatus === "ok" ? "text-green-600" :
                    nStatus === "taken" || nStatus === "error" ? "text-red-600" : "text-gray-500"
                    }`}>
                    {nMsg}
                    </p>
                )}
            </div>

            {/* Password Rules */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-800 mb-1.5">비밀번호</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    className="h-11 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordRules check={pwCheck} />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-800 mb-1.5">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="Enter confirm password"
                className="h-11 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-800 mb-1.5">
                이메일
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="h-11 rounded-lg bg-slate-100/50 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

          </div>

          {/* 가입 버튼 */}
          <div className="mt-8 flex justify-center">
            <button
            type="button"
            onClick={handleJoin}
            disabled={!canSubmit}
            className={`min-w-[160px] rounded-lg px-6 py-3 text-white text-sm font-medium focus:outline-none
                ${canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
            >
            Sign up
            </button>
          </div>

          {/* 약관/개인정보 문구 */}
          <p className="mt-6 text-center text-sm text-gray-500">
            계속 진행하시면{" "}
            <button
              type="button"
              onClick={openTerms}
              className="underline decoration-gray-300 underline-offset-4 hover:text-gray-800 cursor-pointer"
            >
              서비스 약관
            </button>
            {" "}및{" "}
            <button
              type="button"
              onClick={openPrivacy}
              className="underline decoration-gray-300 underline-offset-4 hover:text-gray-800 cursor-pointer"
            >
              개인정보처리방침
            </button>
            에 동의하시는 것으로 간주됩니다.
          </p>

          {/* 약관 모달 */}
          <Modal open={open === "terms"} onClose={close} title="서비스 약관">
            <TermsContent />
          </Modal>

          {/* 개인정보 모달 */}
          <Modal open={open === "privacy"} onClose={close} title="개인정보처리방침">
            <PrivacyContent />
          </Modal>
        </div>
      </div>
    </div>
  );
}
