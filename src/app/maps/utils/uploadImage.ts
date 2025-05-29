'use client'
export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:8080/api/images/upload", {
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
