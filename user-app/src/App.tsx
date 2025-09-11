import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

function App() {
  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>
        <SignedIn>
          <h1>Welcome! You are signed in.</h1>
        </SignedIn>
        <SignedOut>
          <h1>This is the public page. Please sign in.</h1>
        </SignedOut>
      </main>
    </div>
  )
}

export default App
