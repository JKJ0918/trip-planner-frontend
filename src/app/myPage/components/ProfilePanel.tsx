"use client";

import { useMe } from "@/app/hooks/useMe";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = { nickname: string; avatarUrl?: string };

type Props = {
  userNickname?: (nickname: string) => void;
};

export default function ProfilePanel({ userNickname }: Props) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const { me, isLoading, error, refresh } = useMe();

  const [previewUrl, setPreviewUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  // 닉네임 기본 규칙(허용문자 + 길이)
  const NICK_RE = /^[a-zA-Z0-9가-힣._-]{2,20}$/;

  // 수동 중복검사 상태
  const [nickPending, setNickPending] = useState(false);    // 검사 진행중
  const [nickAvailable, setNickAvailable] = useState(true); // 사용 가능 여부
  const [nickChecked, setNickChecked] = useState(true);     // 수동 검사 완료 여부(초기: 기존 닉네임은 통과 간주)

  useEffect(
    () => () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    values: me ? { nickname: me.nickname, avatarUrl: me.avatarUrl } : { nickname: "", avatarUrl: undefined },
    mode: "onChange",
  });

  const currentAvatar = useMemo(() => {
    const toAbs = (p?: string) => (p ? (p.startsWith("http") ? p : `${base}${p}`) : undefined);
    return previewUrl ?? toAbs(watch("avatarUrl")) ?? `${base}/uploads/basic_profile.png`;
  }, [base, previewUrl, watch]);

  const onPickFile = () => inputRef.current?.click();

  const onDrop = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setBanner({ type: "error", msg: "이미지 파일만 업로드할 수 있어요." });
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setSelectedFile(f);
    setBanner(null);
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => onDrop(e.target.files);

  const onSubmit = async (v: FormValues) => {
    setSubmitting(true);
    setBanner(null);
    try {
      let uploadedPath: string | null = null;
      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        const resUp = await fetch(`${base}/api/images/upload`, { method: "POST", body: fd, credentials: "include" });
        if (!resUp.ok) throw new Error("프로필 이미지 업로드 실패");
        const json = await resUp.json();
        uploadedPath = json.url;
      }

      const payload = { nickname: v.nickname, avatarUrl: uploadedPath ?? v.avatarUrl ?? null };
      const res = await fetch(`${base}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("저장 중 오류가 발생했습니다.");

      await refresh();
      userNickname?.(v.nickname);
      reset({ nickname: v.nickname, avatarUrl: payload.avatarUrl ?? undefined });
      setSelectedFile(undefined);
      setPreviewUrl(undefined);
      setBanner({ type: "success", msg: "프로필이 저장되었습니다." });
    } catch (e: any) {
      setBanner({ type: "error", msg: e?.message ?? "오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const resetAvatar = () => {
    setPreviewUrl(undefined);
    setSelectedFile(undefined);
    setValue("avatarUrl", "");
  };

  const nickname = watch("nickname");

  // 값이 바뀌면 "검사 필요"로 되돌림 (현재 닉네임이면 검사 불필요)
  useEffect(() => {
    if (!me) return;
    if (nickname === me.nickname) {
      setNickChecked(true);
      setNickAvailable(true);
      setNickPending(false);
    } else {
      setNickChecked(false);
      setNickAvailable(false);
    }
  }, [nickname, me]);

  // 기존 변경 감지 로직 유지
  const somethingChanged = useMemo(() => {
    const nicknameDirty = formState.dirtyFields.nickname;
    return Boolean(nicknameDirty || selectedFile || watch("avatarUrl") === "");
  }, [formState.dirtyFields.nickname, selectedFile, watch]);

  // 기본 규칙 통과 여부(버튼 활성 조건)
  const basicValid =
    !!nickname &&
    !formState.errors.nickname &&
    NICK_RE.test(nickname) &&
    nickname.trim() === nickname &&
    !/\s/.test(nickname);

  // Save 활성 조건
  const canSave =
    somethingChanged &&
    basicValid &&
    !nickPending &&
    (me && nickname === me.nickname ? true : (nickChecked && nickAvailable));

  // 수동 중복검사
  const handleCheckNickname = async () => {
    if (!basicValid) return; // 기본 규칙 통과 전에는 무시
    if (!me) return;

    if (nickname === me.nickname) {
      // 기존 닉네임이면 검사 없이 통과
      setNickChecked(true);
      setNickAvailable(true);
      clearErrors("nickname");
      return;
    }

    setNickPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/user/nickname-available?nickname=${encodeURIComponent(nickname)}`, // ← 엔드포인트 확인
        { credentials: "include" }
      );
      const json = await res.json(); // { available: boolean } 가정
      const ok = Boolean(json?.available);

      setNickChecked(true);
      setNickAvailable(ok);

      if (!ok) {
        setError("nickname", { type: "manual", message: "이미 사용 중인 닉네임입니다." });
      } else {
        clearErrors("nickname");
      }
    } catch {
      setNickChecked(true);
      setNickAvailable(false);
      setError("nickname", { type: "manual", message: "중복 확인 중 오류가 발생했습니다." });
    } finally {
      setNickPending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-8">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-32 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }
  if (error) {
    return <div className="max-w-5xl p-4 rounded-lg bg-red-100 text-red-600">로그인이 필요하거나 오류가 발생했어요.</div>;
  }
  if (!me) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Account</h1>
        <p className="text-sm text-gray-500">개인 정보를 업데이트하세요.</p>
      </div>

      {banner && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            banner.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {banner.msg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-medium text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-500">영구적인 메일 주소와 닉네임을 관리합니다.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 pt-0 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <div
                  ref={dropRef}
                  className="group relative w-36 h-36 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                  onClick={onPickFile}
                  onDragOver={(e) => {
                    e.preventDefault();
                    dropRef.current?.classList.add("ring-2", "ring-blue-400");
                  }}
                  onDragLeave={() => dropRef.current?.classList.remove("ring-2", "ring-blue-400")}
                  onDrop={(e) => {
                    e.preventDefault();
                    dropRef.current?.classList.remove("ring-2", "ring-blue-400");
                    onDrop(e.dataTransfer.files);
                  }}
                  aria-label="프로필 이미지 변경"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentAvatar} alt="프로필 이미지" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-[11px] px-2 py-1 rounded bg-black/50">
                      Change avatar
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">JPG, GIF 또는 PNG. 1MB 이하 권장.</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={onPickFile} className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                    사진 업로드
                  </button>
                  <button type="button" onClick={resetAvatar} className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                    초기화
                  </button>
                </div>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChangeFile} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-6">
              {/* 닉네임 + 유효성 검사 버튼 */}
              <div className="sm:col-span-3">
                <label className="block text-sm text-gray-700 mb-1">Nickname</label>
                <div className="flex gap-2">
                  <input
                    {...register("nickname", {
                      required: "닉네임을 입력하세요.",
                      minLength: { value: 2, message: "최소 2자 이상" },
                      maxLength: { value: 20, message: "최대 20자 이하" },
                      pattern: { value: NICK_RE, message: "한/영/숫자 및 . _ - 만 사용할 수 있어요." },
                      validate: {
                        noSpaces: (v) => (!/\s/.test(v) ? true : "공백은 사용할 수 없어요."),
                        trimSame: (v) => (v.trim() === v ? true : "앞뒤 공백은 제거해 주세요."),
                      },
                    })}
                    placeholder="닉네임"
                    className={`flex-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      formState.errors.nickname ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={handleCheckNickname}
                    disabled={!basicValid || nickPending}
                    className="shrink-0 px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    aria-disabled={!basicValid || nickPending}
                  >
                    {nickPending ? "확인 중…" : "중복확인"}
                  </button>
                </div>

                {/* 메시지 */}
                {formState.errors.nickname && (
                  <p className="mt-1 text-xs text-red-600">{formState.errors.nickname.message as string}</p>
                )}

                {!formState.errors.nickname && nickname && me && nickname !== me.nickname && (
                  <>
                    {!nickChecked && (
                      <p className="mt-1 text-xs text-gray-500">변경된 닉네임입니다. 우측의 유효성 검사를 진행해 주세요.</p>
                    )}
                    {nickChecked && !nickAvailable && (
                      <p className="mt-1 text-xs text-red-600">이미 사용 중인 닉네임입니다.</p>
                    )}
                    {nickChecked && nickAvailable && (
                      <p className="mt-1 text-xs text-green-600">사용 가능한 닉네임입니다.</p>
                    )}
                  </>
                )}

                <p className="mt-1 text-xs text-gray-500">2~20자, 한/영/숫자 및 . _ - 만 허용</p>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-sm text-gray-700 mb-1">Email address</label>
                <input
                  value={me.email}
                  readOnly
                  className="block w-full rounded-md border border-gray-300 bg-gray-100 text-gray-600 px-3 py-2 placeholder:text-gray-400"
                />
              </div>

              <input type="hidden" {...register("avatarUrl")} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-8">
              <button
                type="button"
                onClick={() => {
                  reset({ nickname: me.nickname, avatarUrl: me.avatarUrl ?? undefined });
                  setSelectedFile(undefined);
                  setPreviewUrl(undefined);
                  setBanner(null);
                  // 닉 상태도 초기화
                  setNickChecked(true);
                  setNickAvailable(true);
                  setNickPending(false);
                  clearErrors("nickname");
                }}
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !canSave}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
