import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartBasket | השוואת מחירים בין סופרמרקטים",
  description: "בנה סל קניות וקבל את המחיר הכי זול",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#F5F5F5] font-['Heebo',sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
