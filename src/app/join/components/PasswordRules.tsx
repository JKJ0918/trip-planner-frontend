'use client'

import { PasswordCheck, strengthScore } from "../utils/passwordRules";

export default function PasswordRules( {check} : {check: PasswordCheck}) {
    const rows: Array<[keyof PasswordCheck, string]> = [
        ["length", "8~32자"],
        ["upper", "대문자 1자 이상"],
        ["lower", "소문자 1자 이상"],
        ["digit", "숫자 1자 이상"],
        ["special", "특수문자 1자 이상"],
        ["noSpace", "공백(띄어쓰기) 없음"],
    ];

    const score = strengthScore(check); // 0 ~ 5

    return (
        <div className="mt-2 rounded-lg p-3 bg-gray-50">
        <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">비밀번호 조건</span>
            <span className="text-xs text-gray-500">
            강도:{" "}
            <strong className={
                score >= 4 ? "text-green-600" : score >= 3 ? "text-yellow-600" : "text-red-600"
            }>
                {score >= 4 ? "강함" : score >= 3 ? "보통" : "약함"}
            </strong>
            </span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-y-1.5 text-sm">
            {rows.map(([k, label]) => (
            <li key={k} className="flex items-center gap-2">
                <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                (check as any)[k] ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-transparent"
                }`}>✓</span>
                <span className={(check as any)[k] ? "text-gray-700" : "text-gray-400"}>{label}</span>
            </li>
            ))}
        </ul>
        {"matchConfirm" in check && check.matchConfirm !== undefined && (
            <p className={`mt-2 text-xs ${check.matchConfirm ? "text-green-600" : "text-red-600"}`}>
            {check.matchConfirm ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
            </p>
        )}
        </div>
    );

}