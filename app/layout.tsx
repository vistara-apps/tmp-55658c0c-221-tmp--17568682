    import type { Metadata } from "next";
    import "./globals.css";
    import { Providers } from "./providers";

    export const metadata: Metadata = {
      title: "VibeFinder",
      description: "Stop doomscrolling, start discovering: Your AI guide to trending local spots.",
    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en">
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
  