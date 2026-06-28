import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/Shared/AppLayout";
import Providers from "@/components/Shared/Providers";
import { getUser } from "@/lib/auth";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "HB Admin",
    description: "HB Admin Panel",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();

    return (
        <html
            lang="en"
            className={`${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Providers user={user}>
                    <AppLayout>{children}</AppLayout>
                </Providers>
            </body>
        </html>
    );
}
