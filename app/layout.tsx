import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Disaster Watch",
  description:
    "O Disaster Watch Monitor é uma plataforma digital desenvolvida com o objetivo de fornecer uma visão clara e acessível sobre eventos extremos que ocorrem ao redor do globo. Em um mundo onde desastres naturais como incêndios, tempestades e terremotos são cada vez mais frequentes e impactantes, esta ferramenta busca centralizar informações de fontes confiáveis, apresentando-as de forma intuitiva para conscientizar e informar o público.",
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
