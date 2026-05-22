import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiamLink - มินิมัล ลิงก์ในไบโอ สำหรับครีเอเตอร์ชาวไทย 🇹🇭",
  description: "สร้างหน้าลิงก์ในไบโอส่วนตัวของคุณฟรี สวยงาม รวดเร็ว รองรับปุ่มแชร์เลขบัญชีโอนเงินแบบคัดลอกในคลิกเดียว บายพาสเบราว์เซอร์ LINE/TikTok ได้ในตัว",
  keywords: ["SiamLink", "Link in Bio", "ลิงก์ในไบโอ", "TikToker", "ครีเอเตอร์", "ปุ่มโอนเงิน", "บายพาส LINE"],
  authors: [{ name: "SiamLink Team" }],

  verification: {
    google: "zgOtjgGcdcozh9URwlrROHCg-Xok0VJEvsXpPfEVbTY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}