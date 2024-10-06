import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JIPMER Blood Bank",
  description: "Open-source large-scale blood bank management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
