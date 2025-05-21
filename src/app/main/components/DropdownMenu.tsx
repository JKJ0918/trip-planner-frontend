// components/DropdownMenu.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

const DropdownMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
      {/* 점 3개 아이콘 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          padding: "0 6px",
          userSelect: "none",
        }}
      >
        &#8942;
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "6px",
            marginTop: "6px",
            minWidth: "150px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            {["Account settings", "Support", "License", "Sign out"].map((item) => (
              <li
                key={item}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                }}
                onClick={() => {
                  alert(`${item} clicked`);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    alert(`${item} clicked`);
                    setOpen(false);
                  }
                }}
                tabIndex={0}
                role="menuitem"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
