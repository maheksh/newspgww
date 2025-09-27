import type { Metadata } from 'next';
import './globals.css'; // Assuming Tailwind CSS is imported here
import './news.css'; // Import your news.css for global styles

// Metadata for SEO and browser
export const metadata: Metadata = {
  title: 'Wize Wealth',
  description: 'Your source for National and International Finance News',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Your source for National and International Finance News" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}