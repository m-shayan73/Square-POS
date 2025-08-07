import { AuthSessionProvider } from "@/providers";
import QueryProvider from "@/providers/TanStackQueryProvider";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "Square POS Application",
  description: "Square POS Application",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const notoSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-heading",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${notoSans.variable} ${robotoMono.variable}`}
    >
      <body>
        <AuthSessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
