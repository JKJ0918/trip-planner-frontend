'use client'
export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/images/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.error("이미지 업로드 실패:", err);
    return null;
  }
}
