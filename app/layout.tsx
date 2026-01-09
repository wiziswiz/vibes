import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VIBES - Where Code Becomes Magic',
  description: 'A magical coding platform for kids ages 6 and up. Speak your ideas and watch them come to life with real code spells!',
  keywords: ['coding for kids', 'learn programming', 'creative coding', 'AI coding', 'educational games', 'kids coding'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="space" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
