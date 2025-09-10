import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center shadow px-4 py-2">
          <h2 className="text-lg font-semibold">서비스 약관</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* 본문: 스크롤 가능 영역 */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* 하단 버튼 */}
        <div className="px-4 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
