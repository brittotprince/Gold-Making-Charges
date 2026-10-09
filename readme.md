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
2. **Base Price (pre-tax):** `Total Price / 1.03` *(Removes the 3% GST)*
3. **Making Charge (Amount):** `Base Price - Gold Value`
4. **Making Charge (%):** `(Making Charge Amount / Gold Value) × 100`

---
*Created to help buyers make informed decisions when purchasing gold jewelry in India.*