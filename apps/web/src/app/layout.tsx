import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Alofy | A platform to battle",
    description: "Battle with your peers and sharpen your skills",
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
