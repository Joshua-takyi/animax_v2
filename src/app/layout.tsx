import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/themeProvider';
import RenderMounted from '@/components/mounted';
import localFont from 'next/font/local';
import QueryProvider from '@/provider/provider';

// Correctly import and configure the local font
const inter = localFont({
  src: '../fonts/Inter-Regular.otf',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Animax',
  description: ' your go to for anything anime and manga recommendations',
  keywords: ['anime', 'manga', 'recommendations', 'reviews'],
  robots: 'index, follow',
  icons: {
    icon: ['/favicon-48x48.png'],
    apple: ['/apple-touch-icon.png'],
    shortcut: ['/favicon.svg'],
  },
  openGraph: {
    title: 'Animax',
    description: ' your go to for anything anime and manga recommendations',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Og Image Alt',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content={metadata.description ?? 'Default description'} />
      </head>
      <body className={`${inter.className} ${inter.variable} antialiased`} suppressHydrationWarning>
        <RenderMounted>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </RenderMounted>
      </body>
    </html>
  );
}
