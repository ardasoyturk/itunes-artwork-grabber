import "~/styles/globals.css";
import { type Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "iTunes Artwork Grabber",
  description: "Simple tool to get artwork from iTunes servers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const IBMPlexFont = IBM_Plex_Mono({
  subsets: ["latin"],
  style: "normal",
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={IBMPlexFont.className}>
      <body>{children}</body>
    </html>
  );
}
