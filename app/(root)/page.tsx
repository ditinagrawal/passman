"use client"

import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <main>
      {isSignedIn ? <Hero /> : (
        <div className="flex flex-col gap-3 items-center justify-center mt-28">
          <h1 className="font-mono text-5xl font-semibold">Welcome to passMan</h1>
          <p className="font-mono">A simple password manager to store your passwords securely.</p>
          <div className="mt-6"><Button onClick={() => window.location.href = "/sign-in"}>Get Started</Button></div>
        </div>
      )}
    </main>
  );
}
