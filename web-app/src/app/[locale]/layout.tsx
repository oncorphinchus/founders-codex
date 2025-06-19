import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/lib/providers';
import '../global.css';

// CONTEXT: Internationalized layout supporting the three philosophical themes
export const metadata = {
  title: 'The Founder\'s Codex',
  description: 'Where ancient wisdom meets modern execution',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // CONTEXT: Load the internationalization messages
  const { locale } = await params;
  const messages = await getMessages();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* CONTEXT: Theme provider supporting Stoic, Deep Work, and Growth themes */}
        <ThemeProvider
          attribute="class"
          defaultTheme="stoic"
          enableSystem={false}
          themes={['stoic', 'deep-work', 'growth']}
        >
          {/* CONTEXT: React Query provider for server state management */}
          <QueryProvider>
            {/* CONTEXT: Internationalization provider */}
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 