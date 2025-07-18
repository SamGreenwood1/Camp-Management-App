import { ClerkProvider } from '@clerk/nextjs';
import AppRouter from '../AppRouter';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

function MyApp() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppRouter />
    </ClerkProvider>
  );
}

export default MyApp; 