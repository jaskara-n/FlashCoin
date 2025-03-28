"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

const { chains, publicClient } = configureChains(
  [baseSepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "FlashCoin",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
