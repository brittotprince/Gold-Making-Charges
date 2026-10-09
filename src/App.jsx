import { useState, useRef, useEffect } from 'react'
import tips from './data/tips.json'
import { getAllQuotes, saveQuote, deleteQuote } from './services/db.js'

export default function App() {
  // Local Gold Rate: initialized from localStorage if previously entered, else blank
  const [goldRate, setGoldRate] = useState(() => {
    return localStorage.getItem('gold_calc_local_rate') || ""
  })
  const [weight, setWeight] = useState("10")
  const [gst, setGst] = useState("3")
  const [totalPrice, setTotalPrice] = useState("165000")

  // Karat selection: Default to 22K (standard for Indian jewelry)
  const [selectedKarat, setSelectedKarat] = useState("22K")
  const base22kRef = useRef(goldRate ? parseFloat(goldRate) : 13815)

  // Buyer tips state & 3D coin flip
  const [tipIndex, setTipIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  // IndexedDB Quotes State (Shopping Comparison)
  const [savedQuotes, setSavedQuotes] = useState([])
  const [itemName, setItemName] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [isSavedFeedback, setIsSavedFeedback] = useState(false)

  // Top ref for smooth scrolling on Edit
  const calculatorRef = useRef(null)

  // Load saved quotes from IndexedDB on component mount
  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    try {
      const quotes = await getAllQuotes()
      setSavedQuotes(quotes)
    } catch (err) {
      console.error('Error loading quotes from IndexedDB:', err)
    }
  }

  // Input handler allowing decimals without jumping the cursor
  const handleInput = (setter) => (e) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value)
      if (setter === setGoldRate) {
        setSelectedKarat("custom")
        if (value) {
          localStorage.setItem('gold_calc_local_rate', value)
          base22kRef.current = parseFloat(value) || base22kRef.current
        } else {
          localStorage.removeItem('gold_calc_local_rate')
        }
      }
    }
  }

  // Handle Karat toggle (22K base)
  const handleKaratSelect = (karat) => {
    setSelectedKarat(karat)
    const base = base22kRef.current || (parseFloat(goldRate) || 13815)

    let newRate = base
    if (karat === "24K") {
      newRate = Math.round(base * (24 / 22))
    } else if (karat === "22K") {
      newRate = Math.round(base)
    } else if (karat === "18K") {
      newRate = Math.round(base * (18 / 22))
    }

    const rateStr = newRate.toString()
    setGoldRate(rateStr)
    localStorage.setItem('gold_calc_local_rate', rateStr)
  }

  // Coin flip (slower 850ms weighted animation + advances tip)
  const handleCoinClick = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setTimeout(() => setIsFlipping(false), 850)
    setTipIndex((prev) => (prev + 1) % tips.length)
  }

  // Financial calculations
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

  // Save / Update Quote in IndexedDB
  const handleSaveQuote = async (e) => {
    e.preventDefault()
    const nameToSave = itemName.trim() || `Quote #${savedQuotes.length + 1} (${selectedKarat})`

    const quoteData = {
      id: editingId || Date.now(),
      name: nameToSave,
      karat: selectedKarat,
      goldRate: goldRate || "0",
      weight,
      gst,
      totalPrice,
      goldValue,
      basePrice,
      makingChargeAmt,
      makingChargePct: parseFloat(makingChargePct.toFixed(2))
    }

    try {
      await saveQuote(quoteData)
      await loadQuotes()
      setItemName("")
      setEditingId(null)
      setIsSavedFeedback(true)
      setTimeout(() => setIsSavedFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to save quote:', err)
    }
  }

  // Edit Quote: Populates calculator
  const handleEditQuote = (quote) => {
    setGoldRate(quote.goldRate)
    setWeight(quote.weight)
    setGst(quote.gst)
    setTotalPrice(quote.totalPrice)
    setSelectedKarat(quote.karat || "custom")
    setItemName(quote.name)
    setEditingId(quote.id)

    if (quote.goldRate) {
      localStorage.setItem('gold_calc_local_rate', quote.goldRate)
      base22kRef.current = parseFloat(quote.goldRate)
    }

    // Smooth scroll back to calculator
    if (calculatorRef.current) {
      calculatorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Cancel Edit mode
  const handleCancelEdit = () => {
    setEditingId(null)
    setItemName("")
  }

  // Delete single quote from IndexedDB
  const handleDeleteQuote = async (id) => {
    try {
      await deleteQuote(id)
      await loadQuotes()
      if (editingId === id) {
        setEditingId(null)
        setItemName("")
      }
    } catch (err) {
      console.error('Failed to delete quote:', err)
    }
  }

  // Find lowest making charge % for "Best Value" indicator (only if >= 2 quotes)
  const validQuotes = savedQuotes.filter((q) => q.goldValue > 0)
  const lowestChargePct =
    validQuotes.length >= 2
      ? Math.min(...validQuotes.map((q) => q.makingChargePct))
      : null

  const currentTip = tips[tipIndex] || tips[0]

  return (
    <div className="w-full max-w-xl my-4 space-y-6">
      
      {/* Main Glass/Obsidian Card */}
      <div 
        ref={calculatorRef}
        className="bg-[#12141a] rounded-2xl shadow-2xl overflow-hidden border border-neutral-800/90 backdrop-blur-md"
      >
        
        {/* Header with Refined Title Typography & Coin */}
        <div className="bg-gradient-to-b from-[#1b1e28] to-[#12141a] p-6 border-b border-neutral-800/80 text-center relative">
          
          {/* Interactive Coin Button */}
          <div className="flex justify-center mb-2.5">
            <button
              type="button"
              onClick={handleCoinClick}
              title="Tap to flip coin & reveal next buyer tip"
              className={`relative group inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 cursor-pointer transition-transform active:scale-95 ${
                isFlipping ? 'coin-flip-anim' : 'hover:scale-105'
              }`}
              aria-label="Flip gold coin for buyer tips"
            >
              <span className="text-xl select-none">🪙</span>
              <span className="absolute -inset-1 rounded-full border border-amber-400/30 group-hover:border-amber-400/60 pointer-events-none" />
            </button>
          </div>

          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-tight">
            Gold Making Charge Calculator (India)
          </h1>
          <p className="text-neutral-400 text-xs mt-1 flex items-center justify-center gap-1.5">
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
          {/* Inputs Section (Reordered Flow) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Gold Rate with 22K Default Active, Check Rate Search & Watermark */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="gold-rate" className="block text-sm font-semibold text-neutral-300">
                  Local Gold Rate/g
                </label>
                {/* Karat Switcher Buttons (22K active by default) */}
                <div className="flex gap-1">
                  {["22K", "24K", "18K"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKaratSelect(k)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedKarat === k
                          ? 'bg-amber-500 text-neutral-950 shadow-sm shadow-amber-500/30 scale-105'
                          : 'bg-neutral-800/80 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="gold-rate"
                  type="text"
                  inputMode="decimal"
                  value={goldRate}
                  onChange={handleInput(setGoldRate)}
                  className="w-full p-3 pr-14 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                  placeholder="e.g. 13815"
                />
                <span className="absolute right-3 text-xs font-mono text-neutral-500 pointer-events-none select-none">
                  ₹ / g
                </span>
              </div>

              {/* Quick Google Search for Today's 22K Rate */}
              <div className="mt-1.5 flex justify-end">
                <a
                  href="https://www.google.com/search?q=gold+price+today+22k+per+gram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400/80 hover:text-amber-300 hover:underline transition-colors flex items-center gap-1"
                  title="Check today's live 22k gold rate on Google"
                >
                  <span>🔍 Check today's 22k rate</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            {/* 2. Weight of Ornament */}
            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Weight of Ornament
              </label>
              <div className="relative flex items-center">
                <input
                  id="weight"
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={handleInput(setWeight)}
                  className="w-full p-3 pr-14 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                  placeholder="e.g. 10.5"
                />
                <span className="absolute right-3 text-xs font-mono text-neutral-500 pointer-events-none select-none">
                  grams
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Net gold weight (excluding stones)
              </p>
            </div>

            {/* 3. GST (%) */}
            <div>
              <label htmlFor="gst" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                GST Rate
              </label>
              <div className="relative flex items-center">
                <input
                  id="gst"
                  type="text"
                  inputMode="decimal"
                  value={gst}
                  onChange={handleInput(setGst)}
                  className="w-full p-3 pr-12 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono"
                  placeholder="e.g. 3"
                />
                <span className="absolute right-3 text-xs font-mono text-neutral-500 pointer-events-none select-none">
                  %
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Standard flat 3% across India
              </p>
            </div>

            {/* 4. Total Final Price Quoted */}
            <div>
              <label htmlFor="total-price" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Total Final Price Quoted
              </label>
              <div className="relative flex items-center">
                <input
                  id="total-price"
                  type="text"
                  inputMode="decimal"
                  value={totalPrice}
                  onChange={handleInput(setTotalPrice)}
                  className="w-full p-3 pr-14 bg-[#0a0b0f] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono font-medium"
                  placeholder="e.g. 165000"
                />
                <span className="absolute right-3 text-xs font-mono text-neutral-500 pointer-events-none select-none">
                  ₹ Total
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Jeweler's final bill amount (inc. tax)
              </p>
            </div>
          </div>

          {/* Results Breakdown Section */}
          <div className="bg-[#0a0b0f] rounded-xl p-5 border border-neutral-800/90 shadow-inner">
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

          {/* Save to IndexedDB Action Bar */}
          <form onSubmit={handleSaveQuote} className="bg-[#0e1017] p-4 rounded-xl border border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <span>🛍️ Save to Shopping Comparisons</span>
                {editingId && (
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                    Editing Mode
                  </span>
                )}
              </span>
              {isSavedFeedback && (
                <span className="text-xs text-emerald-400 font-medium animate-pulse">
                  ✓ Saved to Browser DB!
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item / Store Name (e.g. Kalyan 10g Bangle)"
                className="flex-1 p-2.5 bg-[#08090d] border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:border-amber-500 outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs rounded-lg hover:from-amber-400 hover:to-yellow-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap"
                >
                  {editingId ? '💾 Update Quote' : '💾 Save Quote'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-2.5 bg-neutral-800 text-neutral-300 hover:text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Jeweler's Buyer Tip Card */}
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

      {/* Shopping Comparisons Milestone Grid (Stopwatch Laps Style) */}
      {savedQuotes.length > 0 && (
        <div className="bg-[#12141a] rounded-2xl shadow-xl overflow-hidden border border-neutral-800/90 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📊 Shopping Comparisons</span>
                <span className="text-xs font-mono bg-neutral-800 text-amber-400 px-2 py-0.5 rounded-full">
                  {savedQuotes.length} saved
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Stored in browser IndexedDB — compare quotes side-by-side
              </p>
            </div>
          </div>

          {/* Milestones Cards List */}
          <div className="space-y-3">
            {savedQuotes.map((quote) => {
              const isBest = lowestChargePct !== null && quote.makingChargePct === lowestChargePct
              const isCurrentlyEditing = editingId === quote.id

              return (
                <div
                  key={quote.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrentlyEditing
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-[#0a0b0f] border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white">
                        {quote.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-800 text-amber-300 rounded font-mono">
                        {quote.karat}
                      </span>
                      {isBest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full flex items-center gap-1">
                          <span>✨ Best Value</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {quote.createdAt}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-y border-neutral-900 font-mono">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-sans">Rate</span>
                      <span className="text-neutral-200">₹{parseFloat(quote.goldRate).toLocaleString('en-IN')}/g</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-sans">Weight</span>
                      <span className="text-neutral-200">{quote.weight}g</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-sans">Total Quoted</span>
                      <span className="text-white font-semibold">₹{parseFloat(quote.totalPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-sans">Making Charge</span>
                      <span className="text-amber-400 font-bold">
                        ₹{Math.round(quote.makingChargeAmt).toLocaleString('en-IN')} ({quote.makingChargePct}%)
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-end gap-3 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleEditQuote(quote)}
                      className="text-neutral-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                      title="Load into calculator to edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Remove from saved quotes"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer & Privacy Note */}
      <footer className="text-center text-xs text-neutral-500 pt-2 pb-6 space-y-1.5">
        <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400">
          <span>🔒</span>
          <span>100% Client-Side Privacy: All calculations & quotes stay in your browser.</span>
        </div>
        <div>
          <a
            href="https://github.com/brittotprince/Gold-Making-Charges"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors underline decoration-dotted"
          >
            Get the source code on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
