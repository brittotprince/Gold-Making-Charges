import { useState } from 'react'

export default function App() {
  // Storing state as strings fixes the decimal point cursor bug
  const [totalPrice, setTotalPrice] = useState("165000")
  const [weight, setWeight] = useState("10")
  const [goldRate, setGoldRate] = useState("14270")
  const [gst, setGst] = useState("3")

  // Input handler that allows decimals without jumping the cursor
  const handleInput = (setter) => (e) => {
    const value = e.target.value
    // Regex allows empty string, or numbers with up to one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  // Run calculations safely
  const p = parseFloat(totalPrice) || 0
  const w = parseFloat(weight) || 0
  const r = parseFloat(goldRate) || 0
  const g = parseFloat(gst) || 0

  const goldValue = w * r
  const basePrice = g > -100 ? p / (1 + (g / 100)) : 0
  const makingChargeAmt = basePrice - goldValue
  const makingChargePct = goldValue > 0 ? (makingChargeAmt / goldValue) * 100 : 0

  // Helper for Indian currency formatting
  const formatRupees = (num) =>
    "₹" + num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-amber-500 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Making Charge Calculator</h1>
          <p className="text-amber-100 text-sm mt-1">Find out what you're really paying</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="total-price" className="block text-sm font-semibold text-gray-700 mb-1">
                Total Final Price (₹)
              </label>
              <input
                id="total-price"
                type="text"
                inputMode="decimal"
                value={totalPrice}
                onChange={handleInput(setTotalPrice)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="e.g. 165000"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-1">
                Weight of Ornament (g)
              </label>
              <input
                id="weight"
                type="text"
                inputMode="decimal"
                value={weight}
                onChange={handleInput(setWeight)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="e.g. 10.5"
              />
            </div>
            <div>
              <label htmlFor="gold-rate" className="block text-sm font-semibold text-gray-700 mb-1">
                Local Gold Rate/g (₹)
              </label>
              <input
                id="gold-rate"
                type="text"
                inputMode="decimal"
                value={goldRate}
                onChange={handleInput(setGoldRate)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="e.g. 14270"
              />
            </div>
            <div>
              <label htmlFor="gst" className="block text-sm font-semibold text-gray-700 mb-1">
                GST (%)
              </label>
              <input
                id="gst"
                type="text"
                inputMode="decimal"
                value={gst}
                onChange={handleInput(setGst)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="e.g. 3"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Breakdown
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Pure Gold Value</span>
                <span className="font-medium">{formatRupees(goldValue)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Price Before GST</span>
                <span className="font-medium">{formatRupees(basePrice)}</span>
              </div>

              <hr className="border-gray-200 my-2" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Making Charge (Amount)</span>
                <span className="text-lg font-bold text-red-600">{formatRupees(makingChargeAmt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Making Charge (%)</span>
                <span className="text-lg font-bold text-red-600">
                  {makingChargePct.toLocaleString('en-IN', { maximumFractionDigits: 2 })}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <a
          href="https://github.com/brittotprince/Gold-Making-Charges"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-600 transition-colors underline decoration-dotted"
        >
          Get the source code here
        </a>
      </div>
    </div>
  )
}
