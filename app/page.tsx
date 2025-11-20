import Search from '@/components/Search';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <div className="w-full text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Price Tracker
          </h1>
          <p className="text-neutral-400 text-sm tracking-wide">
            Historical price data for Magic: The Gathering cards
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <Search />
        </div>

      </div>
    </main>
  );
}
