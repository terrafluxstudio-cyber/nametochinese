import NavBar from '@/components/NavBar';

export default function Loading() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
        <div className="h-8 w-40 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
        <div className="h-4 w-28 bg-gray-100 rounded mx-auto mb-8 animate-pulse" />
        <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse mb-4" />
        <div className="flex gap-2 justify-center mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-16 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </>
  );
}
