import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniChat - All AI Models in One Place",
  description: "Access GPT-4o, Claude, Gemini, Llama, Mistral, and more from one unified interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
