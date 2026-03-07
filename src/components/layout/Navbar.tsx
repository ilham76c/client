import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="font-bold text-xl text-white">
          EquityLens
        </Link>

        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/stocks">Stocks</Link>
          <Link href="/ownership">Ownership</Link>
        </div>

      </div>
    </nav>
  );
}