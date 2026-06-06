import NavBar from '@/components/NavBar';

export default function Loading() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
        <div className="h-4 w-36 bg-gray-100 rounded mx-auto mb-8 animate-pulse" />
        <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse mb-6" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 w-full bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </>
  );
}
