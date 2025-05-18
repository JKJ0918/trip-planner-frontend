import { useState } from "react";
import SocialLoginModal from "./SocialLoginModal";

type Provider = "google" | "kakao" | "naver";

const providerUrls: Record<Provider, string> = {
  google: "http://localhost:8080/oauth2/authorization/google",
  kakao: "http://localhost:8080/oauth2/authorization/kakao",
  naver: "http://localhost:8080/oauth2/authorization/naver",
};

const SocialLoginButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const openModal = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleAgree = () => {
    if (selectedProvider) {
      window.location.href = providerUrls[selectedProvider];
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-3">

        {/* Google */}
        <button
            type="button"
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 h-12 w-full hover:bg-gray-100 transition cursor-pointer"
            onClick={() => openModal("google")}
        >
            <svg
            className="w-6 h-6"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            style={{ display: "block" }}
            >
            <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            </svg>
            <span className="text-sm font-bold whitespace-nowrap">Google</span>
        </button>

        {/* Kakao */}
        <button
            type="button"
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 h-12 w-full hover:bg-gray-100 transition cursor-pointer"
            onClick={() => openModal("kakao")}
        >
            <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#3C1E1E"
            >
            <path d="M12 2C6.5 2 2 5.7 2 10.3c0 2.6 1.7 4.8 4.3 6.2-.2.8-.8 2.4-.9 2.6 0 0-.1.2 0 .3.1.2.3.1.3.1l3.1-1.7c.9.1 1.8.2 2.7.2 5.5 0 10-3.7 10-8.3C22 5.7 17.5 2 12 2z" />
            </svg>
            <span className="text-sm font-bold whitespace-nowrap">Kakao</span>
        </button>

        {/* Naver */}
        <button
            type="button"
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 h-12 w-full hover:bg-gray-100 transition cursor-pointer"
            onClick={() => openModal("naver")}
        >
            <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#03C75A"
            >
            <path d="M3 3h6.7l5.6 8.2V3H21v18h-6.7l-5.6-8.2V21H3z" />
            </svg>
            <span className="text-sm font-bold whitespace-nowrap">Naver</span>
        </button>
      </div>

      {isModalOpen && selectedProvider && (
        <SocialLoginModal
          provider={selectedProvider}
          onClose={() => setIsModalOpen(false)}
          onAgree={handleAgree}
        />
      )}
    </>
  );
};

export default SocialLoginButton;
