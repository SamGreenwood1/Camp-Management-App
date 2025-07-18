import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from 'next/app';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp; 