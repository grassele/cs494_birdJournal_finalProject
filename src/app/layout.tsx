import { UserContextProvider } from "@/context/userContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final Project Bird Journal",
  description: "Grassel, Elizabeth, CS 494 Advanced Web Development, Oregon State University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserContextProvider>
        <body style={{ height: '100vh' }}>{children}</body>
      </UserContextProvider>
    </html>
  );
}