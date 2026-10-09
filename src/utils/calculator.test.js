import { describe, it, expect } from 'vitest'
import { calculateMakingCharges } from './calculator.js'

describe('Gold Making Charge Calculator Test Suite', () => {
  // Test Case 1: Standard Chain (12% Making Charge)
  it('Test Case 1: Standard Chain (12% Making Charge, 1 Pavan / 8g)', () => {
    const result = calculateMakingCharges({
      totalPrice: '126536',
      weight: '8',
      goldRate: '13711',
      gst: '3'
    })

    expect(result.rawGoldValue).toBe(109688)
    expect(Number(result.basePrice.toFixed(2))).toBe(122850.49)
    expect(Number(result.makingChargeAmt.toFixed(2))).toBe(13162.49)
    expect(Number(result.makingChargePct.toFixed(2))).toBe(12.00)
    expect(result.makingChargePctFormatted).toBe('12.00%')
    expect(result.isImpossibleBill).toBe(false)
  })

  // Test Case 2: Bridal Necklace (18.5% Making Charge)
  it('Test Case 2: Bridal Necklace (18.5% Making Charge, 45g antique jewelry)', () => {
    const result = calculateMakingCharges({
      totalPrice: '772242',
      weight: '45',
      goldRate: '14060',
      gst: '3'
    })

    expect(result.rawGoldValue).toBe(632700)
    expect(Number(result.basePrice.toFixed(2))).toBe(749749.51)
    expect(Number(result.makingChargeAmt.toFixed(2))).toBe(117049.51)
    expect(Number(result.makingChargePct.toFixed(2))).toBe(18.50)
    expect(result.makingChargePctFormatted).toBe('18.50%')
    expect(result.isImpossibleBill).toBe(false)
  })

  // Test Case 3: Lightweight Ring (25% Making Charge)
  it('Test Case 3: Lightweight Ring (25% Making Charge, 3.5g detailed craftsmanship)', () => {
    const result = calculateMakingCharges({
      totalPrice: '62186',
      weight: '3.5',
      goldRate: '13800',
      gst: '3'
    })

    expect(result.rawGoldValue).toBe(48300)
    expect(Number(result.basePrice.toFixed(2))).toBe(60374.76)
    expect(Number(result.makingChargeAmt.toFixed(2))).toBe(12074.76)
    expect(Number(result.makingChargePct.toFixed(2))).toBe(25.00)
    expect(result.makingChargePctFormatted).toBe('25.00%')
    expect(result.isImpossibleBill).toBe(false)
  })

  // Test Case 4: Non-Standard Tax Rate (Dubai / International 5% VAT)
  it('Test Case 4: Non-Standard Tax Rate (5% VAT UAE / International, 14g bracelet)', () => {
    const result = calculateMakingCharges({
      totalPrice: '233973',
      weight: '14',
      goldRate: '14200',
      gst: '5'
    })

    expect(result.rawGoldValue).toBe(198800)
    expect(Number(result.basePrice.toFixed(2))).toBe(222831.43)
    expect(Number(result.makingChargeAmt.toFixed(2))).toBe(24031.43)
    expect(Number(result.makingChargePct.toFixed(2))).toBe(12.09)
    expect(result.makingChargePctFormatted).toBe('12.09%')
    expect(result.isImpossibleBill).toBe(false)
  })

  // Edge Case 1: Price Lower Than Raw Gold Value (Impossible Bill)
  it('Edge Case 1: Detects impossible bills where price is lower than raw gold value', () => {
    const result = calculateMakingCharges({
      totalPrice: '50000',
      weight: '10',
      goldRate: '14000',
      gst: '3'
    })

    expect(result.rawGoldValue).toBe(140000)
    expect(result.makingChargeAmt).toBeLessThan(0)
    expect(result.isImpossibleBill).toBe(true)
  })

  // Edge Case 2: Zero Weight or Zero Gold Rate (Prevents NaN / Infinity)
  it('Edge Case 2: Safely handles zero weight or zero rate without NaN or Infinity', () => {
    const resultZeroWeight = calculateMakingCharges({
      totalPrice: '50000',
      weight: '0',
      goldRate: '14000',
      gst: '3'
    })

    expect(resultZeroWeight.rawGoldValue).toBe(0)
    expect(resultZeroWeight.makingChargePct).toBe(0)
    expect(resultZeroWeight.makingChargePctFormatted).toBe('0.00%')
    expect(Number.isNaN(resultZeroWeight.makingChargePct)).toBe(false)
    expect(Number.isFinite(resultZeroWeight.makingChargePct)).toBe(true)

    const resultZeroRate = calculateMakingCharges({
      totalPrice: '50000',
      weight: '10',
      goldRate: '0',
      gst: '3'
    })

    expect(resultZeroRate.rawGoldValue).toBe(0)
    expect(resultZeroRate.makingChargePct).toBe(0)
    expect(Number.isNaN(resultZeroRate.makingChargePct)).toBe(false)
  })

  // Edge Case 3: Tax Rate <= -100% (Prevents Division by Zero)
  it('Edge Case 3: Handles edge tax rates without division by zero crash', () => {
    const result = calculateMakingCharges({
      totalPrice: '50000',
      weight: '10',
      goldRate: '14000',
      gst: '-100'
    })

    expect(Number.isNaN(result.basePrice)).toBe(false)
    expect(Number.isFinite(result.basePrice)).toBe(true)
  })
})
