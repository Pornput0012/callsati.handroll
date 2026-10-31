import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteNav } from "@/components/SiteNav";

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "ดูดวงไพ่ทาโร่ต์ | แฮนโรล",
  description: "เลือกไพ่ที่จั่วได้ อ่านคำทำนาย รับโปสเตอร์ character และซอสประจำตัว",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <SiteNav />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
