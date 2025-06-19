import { getRequestConfig } from 'next-intl/server';

// CONTEXT: Internationalization setup for global accessibility to wisdom and growth tools
export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || 'en',
    messages: (await import(`../messages/${locale || 'en'}.json`)).default
  };
}); 