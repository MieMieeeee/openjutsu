import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Openjutsu",
  description: "Open-source character swap for video, powered by ComfyUI and MiniMax H3.",
};

// Applies the saved (or browser) language to <html> before the first paint.
const langScript = `try{var l=localStorage.getItem("openjutsu.lang");if(l!=="zh"&&l!=="en")l=(navigator.language||"en").toLowerCase().startsWith("zh")?"zh":"en";document.documentElement.lang=l==="zh"?"zh-CN":"en";}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
        {children}
      </body>
    </html>
  );
}
