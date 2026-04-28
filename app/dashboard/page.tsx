import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Biz Anal</h1>
        <UserButton />
      </header>
      <div className="flex items-center justify-center h-[calc(100vh-65px)]">
        <p className="text-gray-500">Search coming in M2.</p>
      </div>
    </main>
  );
}
