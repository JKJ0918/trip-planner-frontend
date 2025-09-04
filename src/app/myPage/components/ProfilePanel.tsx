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

  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const { register, handleSubmit, reset, watch, setValue, formState } = useForm<FormValues>({
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

  const somethingChanged = useMemo(() => {
    const nicknameDirty = formState.dirtyFields.nickname;
    return Boolean(nicknameDirty || selectedFile || watch("avatarUrl") === "");
  }, [formState.dirtyFields.nickname, selectedFile, watch]);

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
              <div className="sm:col-span-3">
                <label className="block text-sm text-gray-700 mb-1">Nickname</label>
                <input
                  {...register("nickname", { required: true, minLength: 2, maxLength: 20 })}
                  placeholder="닉네임"
                  className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    formState.errors.nickname ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">2~20자. 추후 중복검사/금칙어 적용 가능</p>
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
                }}
                disabled={submitting}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !somethingChanged}
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
