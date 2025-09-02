import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Smart Blinds",
  description: "Smart Blinds",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
