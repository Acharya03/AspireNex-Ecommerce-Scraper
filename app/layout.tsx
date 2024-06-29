import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const spacegrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
	title: "Pricewatch",
	description: "Track product prices easily and save your money and time while shopping online!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="max-w-10xl">
					<Navbar/>
					{children}
				</main>
			</body>
		</html>
	);
}
