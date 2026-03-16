import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Decision Review Study",
  description:
    "A participant-facing decision review study with configurable AI recommendation framing.",
};

const bodyStyle = {
  margin: 0,
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 15% 10%, rgba(188, 216, 208, 0.55), transparent 28%), radial-gradient(circle at 85% 0%, rgba(222, 210, 191, 0.5), transparent 24%), linear-gradient(180deg, #f7f4ec 0%, #f2eee5 100%)",
  color: "#1f2933",
  fontFamily: '"Avenir Next", "Optima", "Helvetica Neue", sans-serif',
};

const shellStyle = {
  maxWidth: "1120px",
  margin: "0 auto",
  padding: "36px 20px 72px",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
        <div style={shellStyle}>{children}</div>
      </body>
    </html>
  );
}
