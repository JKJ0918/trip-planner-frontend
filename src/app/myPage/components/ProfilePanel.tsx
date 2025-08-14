"use client"

import { useMe } from "@/app/hooks/useMe";
import { useForm } from "react-hook-form";

type FormValues = { nickname: string };

export default function ProfilePanel(){
    const { me, isLoading, error, refresh } = useMe();
    const { register, handleSubmit, reset } = useForm<FormValues>({
        values: me ? { nickname: me.nickname } : { nickname: "" },
    });

    if (isLoading) {
        return <div className="animate-pulse text-gray-400">불러오는 중…</div>;
    } 
    if (error) {
        return <div className="text-red-500">로그인이 필요하거나 오류가 발생했어요.</div>;
    } 
    if (!me) {
        return null;
    }

    const onSubmit = async (v: FormValues) => {
        const res = await fetch("/users/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nickname: v.nickname}),
        });
        if(res.ok){
            await refresh();
            alert("프로필이 저장되었습니다.");
            reset({ nickname: v.nickname });
        } else {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <div>
            <label className="block text-sm text-gray-600 mb-1">이메일</label>
            <input
            value={me.email}
            readOnly
            className="w-full rounded border bg-gray-100 px-3 py-2"
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 mb-1">닉네임</label>
            <input
            {...register("nickname", { required: true, minLength: 2, maxLength: 20 })}
            placeholder="닉네임"
            className="w-full rounded border px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">2~20자. 추후 금칙어/중복검사 추가 가능</p>
        </div>

        <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            저장
        </button>
        </form>
    );

}