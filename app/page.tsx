import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Biz Anal
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Find local businesses with obvious revenue leaks. Ranked by how easy
          they are to sell to and what service you should pitch.
        </p>
      </div>
      <SignInButton mode="modal">
        <Button size="lg">Get started</Button>
      </SignInButton>
    </main>
  );
}
