// Core calculation and formatting logic with robust edge-case handling

export function calculateMakingCharges({ totalPrice, weight, goldRate, gst }) {
  const p = parseFloat(totalPrice) || 0
  const w = parseFloat(weight) || 0
  const r = parseFloat(goldRate) || 0
  const g = parseFloat(gst) || 0

  // Edge Case 2: Zero weight or rate
  const rawGoldValue = w * r

  // Edge Case 3: Safe tax divisor (prevents division by zero or negative tax inversion)
  const basePrice = g > -100 && (1 + g / 100) > 0 ? p / (1 + g / 100) : 0

  const makingChargeAmt = basePrice - rawGoldValue

  // Edge Case 2: Prevents NaN / Infinity when rawGoldValue is 0
  const makingChargePct =
    rawGoldValue > 0 ? (makingChargeAmt / rawGoldValue) * 100 : 0

  // Edge Case 1: Impossible bill where quoted price is less than raw bullion value
  const isImpossibleBill = p > 0 && w > 0 && r > 0 && makingChargeAmt < 0

  return {
    rawGoldValue,
    basePrice,
    makingChargeAmt,
    makingChargePct,
    isImpossibleBill,
    // Rounded precision helpers
    pureGoldValueFormatted: formatRupees(rawGoldValue),
    basePriceFormatted: formatRupees(basePrice),
    makingChargeAmtFormatted: formatRupees(makingChargeAmt),
    makingChargePctFormatted:
      makingChargePct.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + '%'
  }
}

export function formatRupees(num) {
  if (isNaN(num) || !isFinite(num)) return '₹0.00'
  return (
    '₹' +
    num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  )
}
