// src/app/join/utils/passwordRules.ts

export type PasswordCheck = {
  length: boolean;        // 8~32자
  upper: boolean;         // 대문자 1+
  lower: boolean;         // 소문자 1+
  digit: boolean;         // 숫자 1+
  special: boolean;       // 특수문자 1+
  noSpace: boolean;       // 공백 없음
  matchConfirm?: boolean; // (옵션) 비밀번호 확인 일치
};

export function checkPassword(
password: string, confirm?: string): PasswordCheck {
    const specialRe = /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/;
    const lowerRe = /[a-z]/;
    const upperRe = /[A-Z]/;
    const digitRe = /\d/;
    const spaceRe = /\s/;

    return {
        length: password.length >= 8 && password.length <= 32,
        upper: upperRe.test(password),
        lower: lowerRe.test(password),
        digit: digitRe.test(password),
        special: specialRe.test(password),
        noSpace: !spaceRe.test(password),
        matchConfirm: confirm !== undefined ? confirm === password : undefined,
  };
}

// 전체 통과 여부
export function allPassed(check: PasswordCheck) {
    const { matchConfirm, ...rest } = check;
    const basics = Object.values(rest).every(Boolean);
    return matchConfirm === undefined ? basics : basics && !!matchConfirm;
}

// 비밀번호 강도 점수(0~5)
export function strengthScore(check: PasswordCheck) {
    let s = 0;
    if (check.length) s++;
    if (check.lower) s++;
    if (check.upper) s++;
    if (check.digit) s++;
    if (check.special) s++;
    return s;
}