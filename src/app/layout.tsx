import type { Metadata } from "next";

import "./global.css";

export const metadata: Metadata = {
  title: "Geolocation IP experiment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen max-w-screen-lg m-auto p-8">{children}</body>
    </html>
  );
}
