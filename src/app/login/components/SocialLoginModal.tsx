import { useState } from "react";

interface Props {
  provider: "google" | "kakao" | "naver";
  onClose: () => void;
  onAgree: () => void;
}

const providerText = {
  google: "Google",
  kakao: "Kakao",
  naver: "Naver",
};

const SocialLoginModal: React.FC<Props> = ({ provider, onClose, onAgree }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">개인 정보 제공 동의</h2>
        <p className="text-sm mb-4">
          소셜 로그인을 위해 <strong>{providerText[provider]}</strong>에 개인정보가 제공됩니다.
          동의하십니까?
        </p>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          동의합니다
        </label>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            취소
          </button>
          <button
            onClick={onAgree}
            disabled={!checked}
            className={`px-4 py-2 rounded text-white ${
              checked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginModal;
