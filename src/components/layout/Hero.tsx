export default function Hero() {
  return (
    <section className="py-24 text-center bg-gray-950">

      <h1 className="text-5xl font-bold mb-6">
        Understand Who Owns The Market
      </h1>

      <p className="text-gray-400 mb-10 text-lg">
        EquityLens helps investors analyze institutional ownership
        and shareholder changes across Indonesian stocks.
      </p>

      <div className="flex justify-center gap-4">

        <button className="bg-blue-600 px-6 py-3 rounded-lg">
          Explore Stocks
        </button>

        <button className="border border-gray-700 px-6 py-3 rounded-lg">
          View Ownership Charts
        </button>

      </div>

    </section>
  );
}