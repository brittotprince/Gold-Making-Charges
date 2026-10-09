import { useState, useRef } from 'react'
import tips from './data/tips.json'

export default function App() {
  // Storing state as strings fixes the decimal point cursor bug
  const [totalPrice, setTotalPrice] = useState("165000")
  const [weight, setWeight] = useState("10")
  const [goldRate, setGoldRate] = useState("14270")
  const [gst, setGst] = useState("3")

  // Easter Egg 2: Tips reader from tips.json
  const [tipIndex, setTipIndex] = useState(0)

  // Easter Egg 3: Karat switcher
  const [selectedKarat, setSelectedKarat] = useState("custom")
  const base24kRef = useRef(14270)

  // Animation state for coin flip (smooth 850ms flip)
  const [isFlipping, setIsFlipping] = useState(false)

  // Input handler that allows decimals without jumping the cursor
  const handleInput = (setter) => (e) => {
    const value = e.target.value
    // Regex allows empty string, or numbers with up to one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value)
      if (setter === setGoldRate) {
        setSelectedKarat("custom")
      }
    }
  }

  // Handle coin click (flips coin with slower, weighted animation + advances tip)
  const handleCoinClick = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setTimeout(() => setIsFlipping(false), 850)
    setTipIndex((prev) => (prev + 1) % tips.length)
  }

  // Handle Karat switcher
  const handleKaratSelect = (karat) => {
    setSelectedKarat(karat)
    const currentRate = parseFloat(goldRate) || base24kRef.current

    if (karat === "24K") {
      const rate24k = base24kRef.current || currentRate
      setGoldRate(Math.round(rate24k).toString())
    } else if (karat === "22K") {
      const rate22k = (base24kRef.current || currentRate) * (22 / 24)
      setGoldRate(Math.round(rate22k).toString())
    } else if (karat === "18K") {
      const rate18k = (base24kRef.current || currentRate) * (18 / 24)
      setGoldRate(Math.round(rate18k).toString())
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

  const currentTip = tips[tipIndex]

  return (
    <div className="w-full max-w-xl my-4">
      {/* Main Glass/Obsidian Card */}
      <div className="bg-[#12141a] rounded-2xl shadow-2xl overflow-hidden border border-neutral-800/90 backdrop-blur-md">
        
        {/* Header with Title and Interactive Coin Easter Egg */}
        <div className="bg-gradient-to-b from-[#1b1e28] to-[#12141a] p-6 border-b border-neutral-800/80 text-center relative">
          
          {/* Interactive Coin Button */}
          <div className="flex justify-center mb-3">
            <button
              type="button"
              onClick={handleCoinClick}
              title="Tap to flip coin & reveal next buyer tip"
              className={`relative group inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 cursor-pointer transition-transform active:scale-95 ${
                isFlipping ? 'coin-flip-anim' : 'hover:scale-105'
              }`}
              aria-label="Flip gold coin for buyer tips"
            >
              <span className="text-2xl select-none">🪙</span>
              {/* Subtle pulsing ring hint */}
              <span className="absolute -inset-1 rounded-full border border-amber-400/30 group-hover:border-amber-400/60 pointer-events-none" />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-tight">
            Gold Making Charge Calculator (India)
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1.5 flex items-center justify-center gap-1.5">
            <span>Find out what you're really paying</span>
            <span className="text-neutral-600">•</span>
            <button
              onClick={handleCoinClick}
              className="text-amber-400/80 hover:text-amber-300 underline decoration-dotted transition-colors text-xs cursor-pointer"
            >
              tap coin for tips 💡
            </button>
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Total Price */}
            <div>
              <label htmlFor="total-price" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Total Final Price (₹)
              </label>
              <input
                id="total-price"
                type="text"
                inputMode="decimal"
                value={totalPrice}
                onChange={handleInput(setTotalPrice)}
                className="w-full p-3 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                placeholder="e.g. 165000"
              />
            </div>

            {/* 2. Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Weight of Ornament (g)
              </label>
              <input
                id="weight"
                type="text"
                inputMode="decimal"
                value={weight}
                onChange={handleInput(setWeight)}
                className="w-full p-3 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                placeholder="e.g. 10.5"
              />
            </div>

            {/* 3. Gold Rate with Karat Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="gold-rate" className="block text-sm font-semibold text-neutral-300">
                  Local Gold Rate/g (₹)
                </label>
                {/* Karat Switcher Buttons */}
                <div className="flex gap-1 text-[11px]">
                  {["24K", "22K", "18K"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKaratSelect(k)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedKarat === k
                          ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                          : 'bg-neutral-800/80 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <input
                id="gold-rate"
                type="text"
                inputMode="decimal"
                value={goldRate}
                onChange={handleInput(setGoldRate)}
                className="w-full p-3 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                placeholder="e.g. 14270"
              />
            </div>

            {/* 4. GST */}
            <div>
              <label htmlFor="gst" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                GST (%)
              </label>
              <input
                id="gst"
                type="text"
                inputMode="decimal"
                value={gst}
                onChange={handleInput(setGst)}
                className="w-full p-3 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                placeholder="e.g. 3"
              />
            </div>
          </div>

          {/* Results Breakdown Section */}
          <div className="mt-6 bg-[#0a0b0f] rounded-xl p-5 border border-neutral-800/90 shadow-inner">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Financial Breakdown</span>
              <span className="text-[11px] font-normal text-neutral-500">Reverse-Calculated</span>
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-neutral-300 text-sm">
                <span>Pure Gold Value</span>
                <span className="font-semibold text-white font-mono">{formatRupees(goldValue)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-300 text-sm">
                <span>Price Before GST</span>
                <span className="font-semibold text-white font-mono">{formatRupees(basePrice)}</span>
              </div>

              <hr className="border-neutral-800 my-2.5" />

              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-neutral-200">Making Charge (Amount)</span>
                <span className="text-lg font-bold text-amber-400 font-mono">
                  {formatRupees(makingChargeAmt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-neutral-200">Making Charge (%)</span>
                <span className="text-lg font-bold text-amber-400 font-mono">
                  {makingChargePct.toLocaleString('en-IN', { maximumFractionDigits: 2 })}%
                </span>
              </div>
            </div>
          </div>

          {/* Jeweler's Insider Tip Card (Easter Egg 2) */}
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>💡 Buyer Tip #{currentTip.id} of {tips.length}</span>
              </span>
              <button
                type="button"
                onClick={handleCoinClick}
                className="text-[11px] text-amber-400/80 hover:text-amber-300 underline decoration-dotted transition-colors cursor-pointer"
              >
                Next Tip &rarr;
              </button>
            </div>
            <h3 className="text-sm font-semibold text-amber-200 mb-1">
              {currentTip.title}
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {currentTip.tip}
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-neutral-500">
        <a
          href="https://github.com/brittotprince/Gold-Making-Charges"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-400 transition-colors underline decoration-dotted"
        >
          Get the source code on GitHub
        </a>
      </footer>
    </div>
  )
}
