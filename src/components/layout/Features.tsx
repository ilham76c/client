export default function Features() {
  return (
    <section className="py-20 bg-gray-950">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Ownership Tracking</h3>
          <p className="text-gray-400">
            Track institutional ownership trends across time.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Shareholder Analysis</h3>
          <p className="text-gray-400">
            Understand who controls the company.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-2">Data Visualization</h3>
          <p className="text-gray-400">
            Interactive charts designed for investors.
          </p>
        </div>

      </div>

    </section>
  );
}