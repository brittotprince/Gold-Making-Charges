# Gold Making Charge Calculator (India) 🥇

<div align="center">
  <p>A simple, privacy-first web application to help you uncover the exact making charge amount and percentage hidden in your gold jewelry bills in India.</p>
  
  [![Live Demo](https://img.shields.io/badge/Demo-Live%20Now-success?style=for-the-badge&logo=github)](https://brittotprince.github.io/Gold-Making-Charges/)
</div>

---

Jewelers in India typically calculate the final price of an ornament using the gold value, making charges, and a flat 3% GST. This calculator reverse-engineers that math so you know exactly what you're paying for.

## ✨ Features
* **Real-time Math:** Calculates the making charges instantly as you type.
* **In-Store Shopping Comparisons:** Save quotes from different jewelers to compare side-by-side (like milestone laps).
* **22K / 24K / 18K Presets:** Defaulted to 22K (the standard for Indian jewelry) with one-click Karat conversion.
* **Quick Rate Lookup:** Direct link to check today's live 22K gold rate per gram.
* **Persistent Rate:** Remembers your local city's gold rate in your browser so you don't have to re-enter it at every store.
* **Bug-Free Decimals:** Safely handles decimal inputs without the cursor jumping around.
* **Mobile Friendly:** Fully responsive dark/obsidian theme designed for quick checks at showroom counters.

## 🔒 100% Client-Side Privacy
All calculations, local gold rates, and saved shopping quotes are stored **exclusively in your browser** using native IndexedDB and LocalStorage. 
* **Zero data tracking:** No data is ever sent to any server or third party.
* **Complete offline operation:** Works entirely on your device with no backend dependencies.

## 🧮 The Math Behind It
1. **Gold Value:** `Weight × Local Gold Rate per gram`
2. **Base Price (pre-tax):** `Total Price / (1 + GST / 100)` *(Removes the 3% GST)*
3. **Making Charge (Amount):** `Base Price - Gold Value`
4. **Making Charge (%):** `(Making Charge Amount / Gold Value) × 100`

---

## 🧪 Automated Test Suite & Verified Cases

The mathematical engine is validated via Vitest (`npm test`).

### Test Case 1: Standard Chain (12.00% Making Charge)
* **Scenario**: 1 Pavan (8 grams) simple low-wastage chain.
* **Inputs**: Price = `₹126,536`, Weight = `8g`, Rate = `₹13,711/g`, GST = `3%`
* **Verified**: Gold Value = `₹109,688.00`, Base Price = `₹122,850.49`, Making Charge = `₹13,162.49 (12.00%)`

### Test Case 2: Bridal Necklace (18.50% Making Charge)
* **Scenario**: 45 grams antique bridal necklace.
* **Inputs**: Price = `₹772,242`, Weight = `45g`, Rate = `₹14,060/g`, GST = `3%`
* **Verified**: Gold Value = `₹632,700.00`, Base Price = `₹749,749.51`, Making Charge = `₹117,049.51 (18.50%)`

### Test Case 3: Lightweight Ring (25.00% Making Charge)
* **Scenario**: 3.5 grams intricate filigree ring.
* **Inputs**: Price = `₹62,186`, Weight = `3.5g`, Rate = `₹13,800/g`, GST = `3%`
* **Verified**: Gold Value = `₹48,300.00`, Base Price = `₹60,374.76`, Making Charge = `₹12,074.76 (25.00%)`

### Test Case 4: Non-Standard Tax (Dubai / International 5% VAT)
* **Scenario**: 14 grams everyday bracelet under 5% UAE VAT.
* **Inputs**: Price = `₹233,973`, Weight = `14g`, Rate = `₹14,200/g`, GST = `5%`
* **Verified**: Gold Value = `₹198,800.00`, Base Price = `₹222,831.43`, Making Charge = `₹24,031.43 (12.09%)`

### Edge Case Guards
* **Impossible Bill Alert**: Flags quotes where total price is less than raw bullion value.
* **Zero Weight / Rate**: Safely outputs `0.00%` with zero `NaN` or `Infinity` crashes.
* **Extreme Tax Inversions**: Guards against division by zero if negative tax values are entered.

---
*Created to help buyers make informed decisions when purchasing gold jewelry in India.*