import { UserButton } from "@clerk/nextjs";
import { SearchSection } from "./_components/search-section";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Biz Anal</h1>
        <UserButton />
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Find opportunities</h2>
          <p className="mt-1 text-gray-500 text-sm">
            Search for a business type and location to surface revenue gaps and service pitches.
          </p>
        </div>
        <SearchSection />
      </div>
    </main>
  );
}
