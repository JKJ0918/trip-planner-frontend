"use client"

import { useMe } from "@/app/hooks/useMe";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = { nickname: string; avatarUrl?: string };

// 부모(myPage/page.tsx)에게 전달
type Props = {
    userNickname? : (nickname: string) => void;
};

export default function ProfilePanel({userNickname}: Props){
    const base = process.env.NEXT_PUBLIC_API_BASE;
    const { me, isLoading, error, refresh } = useMe();

    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(); // 새로 업로드 이미지(미저장) 미리보기 URL
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string>();   // blob:... 즉시 미리보기
    const [selectedFile, setSelectedFile] = useState<File>(); // 저장 시 업로드할 파일

    useEffect(() => {
    return () => {
        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
    }, [previewUrl]);


    const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
        values: me ? { nickname: me.nickname, avatarUrl: me.avatarUrl } : { nickname: "", avatarUrl: undefined },
    });

    const toAbs = (p?: string) => (p ? (p.startsWith("http") ? p : `${base}${p}`) : undefined);

    const currentAvatar =
    previewUrl                            // 선택 직후 즉시 보여줌 (blob)
    ?? toAbs(watch("avatarUrl"))          // 기존 서버 값
    ?? `${base}/uploads/basic_profile.png`;


    if (isLoading) {
        return <div className="animate-pulse text-gray-400">불러오는 중…</div>;
    } 
    if (error) {
        return <div className="text-red-500">로그인이 필요하거나 오류가 발생했어요.</div>;
    } 
    if (!me) {
        return null;
    }

    // 이미지 업로드
    const handlePickFile = (() => {
        fileRef.current?.click();
    })

    const uploadImage = async (file: File) => {
        setUploading(true); // 중복 클릭 방지
        try{
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch(`${base}/api/images/upload`, {
                method: "POST",
                body: fd,
                credentials: "include",
            });
            if(!res.ok){
                throw new Error("ProfilePanel.tsx/uploadImage:upload fail");
            }
            const json = await res.json(); // {url: string}
            setLocalAvatarUrl(json.url);
        } catch (e) {
            alert("프로필 이미지 업로드 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };
    

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if(!f){
            return;
            // 간단한 클라이언트 검즘(옵션)
        }
        if(!f.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있어요.");
            return;
        }
        // 미리보기만 설정
        const objUrl = URL.createObjectURL(f);
        setPreviewUrl(objUrl);
        setSelectedFile(f);

    }

    const onSubmit = async (v: FormValues) => {
        // 1) 파일이 선택되어 있으면 업로드
        let uploadedPath: string | null = null;
        if(selectedFile) {
            const fd = new FormData();
            fd.append("file", selectedFile);
            const resUp = await fetch(`${base}/api/images/upload`, {
                method: "POST",
                body: fd,
                credentials: "include",
            });
            if(!resUp) {
                alert("프로필 이미지 업로드 실패");
                return;
            }
            const json = await resUp.json(); // { url: "/uploads/xxx.png" }
            uploadedPath = json.url;
        }
        
        // 2) PUT /user/me
        const payload = {
            nickname: v.nickname,
            avatarUrl: uploadedPath ?? v.avatarUrl ?? null, // null로 보내면 제거로 처리할 수도 있음
        };

        const res = await fetch(`${base}/users/me`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if(res.ok){
            await refresh();
            userNickname?.(v.nickname);
            alert("프로필이 저장되었습니다.");
            reset({ nickname: v.nickname, avatarUrl: payload.avatarUrl ?? undefined });
            // setLocalAvatarUrl(undefined); // 저장 후 로컬 미리보기 상태 초기화
            setPreviewUrl(undefined);
            setSelectedFile(undefined);
        } else {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const resetToDefault = () => {
        // setLocalAvatarUrl(undefined);
        setPreviewUrl(undefined);
        setSelectedFile(undefined);
        setValue("avatarUrl", ""); // 서버에서 기본화(null)로 처리
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        {/* 아바타 섹션 */}
        <section className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={currentAvatar}
                alt="프로필 이미지"
                className="w-full h-full object-cover"
            />
            </div>

            <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <button
                type="button"
                onClick={handlePickFile}
                className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-black disabled:opacity-60"
                disabled={uploading}
                >
                {uploading ? "업로드 중…" : "사진 변경"}
                </button>
                <button
                type="button"
                onClick={resetToDefault}
                className="px-3 py-2 rounded border hover:bg-gray-50"
                >
                기본 이미지로
                </button>
            </div>
            <p className="text-xs text-gray-500">
                JPG/PNG, 5MB 이하 권장. 정사각형 이미지가 가장 예쁘게 보여요.
            </p>
            </div>

            <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChangeFile}
            />
        </section>

        {/* 이메일 */}
        <div>
            <label className="block text-sm text-gray-600 mb-1">이메일</label>
            <input
            value={me.email}
            readOnly
            className="w-full rounded border bg-gray-100 px-3 py-2"
            />
        </div>

        {/* 닉네임 */}
        <div>
            <label className="block text-sm text-gray-600 mb-1">닉네임</label>
            <input
            {...register("nickname", { required: true, minLength: 2, maxLength: 20 })}
            placeholder="닉네임"
            className="w-full rounded border px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">2~20자. 추후 금칙어/중복검사 추가 가능</p>
        </div>

        {/* 숨김 필드: 서버에 저장된 아바타 URL 보관 */}
        <input type="hidden" {...register("avatarUrl")} />

        <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            저장
        </button>
        </form>
    );
}