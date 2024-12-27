import "../styles/globals.css";

import { Inter, Libre_Baskerville } from "next/font/google";

import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "../prismicio";
import { Footer} from "../components/Footer"
import {Header, } from "../components/Header"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const libre_baskerville = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  variable: "--libre-baskerville",
  display: "swap",
});

export default function RootLayout({ children }) {

  return (
    <html
      lang="en"
      className={`${inter.className} ${libre_baskerville.className}`}
    >
      <body className="overflow-x-hidden antialiased">
        <main>
        <div className="text-slate-700">
      <Header
        withProfile={true}
        withDivider={true}
      />
      {children}
      <Footer  />
    </div>
        </main>
      </body>
    </html>
  );
}
