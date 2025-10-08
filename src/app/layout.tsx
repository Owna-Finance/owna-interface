import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import { OnchainProviders } from "@/providers/onchainkit-provider";
import "./globals.css";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Owna",
  description: "Access premium hotel property cashflows through blockchain tokenization.",
  icons: {
    icon: [
      { url: '/Images/Logo/owna-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Images/Logo/owna-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/Images/Logo/owna-logo.png',
    apple: [
      { url: '/Images/Logo/owna-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    "RWA tokenization",
    "hotel real estate investment", 
    "monthly returns",
    "blockchain investment",
    "property tokens",
    "real estate crowdfunding",
    "hotel cashflow",
    "tokenized assets"
  ],
  authors: [{ name: "OWNA" }],
  creator: "OWNA",
  publisher: "OWNA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://owna.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Owna",
    description: "Access premium hotel property cashflows through blockchain tokenization. Start earning monthly distributions with investments as low as $1,000.",
    url: 'https://owna.io',
    siteName: 'OWNA',
    images: [
      {
        url: '/Images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OWNA - Hotel Real Estate Tokenization Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owna',
    description: 'Access premium hotel property cashflows through blockchain tokenization. Start earning monthly distributions with investments as low as $1,000.',
    images: ['/Images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.error && e.error.context === 'AnalyticsSDKApiError') {
                  e.preventDefault();
                  console.warn('Analytics SDK error suppressed:', e.error.message);
                  return false;
                }
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && (
                  e.reason.context === 'AnalyticsSDKApiError' ||
                  e.reason.message?.includes('Failed to fetch') && e.reason.stack?.includes('_t(')
                )) {
                  e.preventDefault();
                  console.warn('Analytics fetch error suppressed:', e.reason);
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${kantumruyPro.variable} antialiased bg-black overscroll-none`}
        style={{ overscrollBehavior: 'none' }}
      >
        <OnchainProviders>
          {children}
        </OnchainProviders>
      </body>
    </html>
  );
}
