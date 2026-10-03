import type { Metadata } from "next";
import "./globals.css";
import "./tour.css";
import "./tabletop.css";

export const metadata: Metadata = {
  title: "Konstancin Business Club — gra planszowa",
  description: "Zbuduj lokalne imperium. Gra planszowa w Konstancinie i okolicach: online ze znajomymi, z botami lub na jednym ekranie.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
