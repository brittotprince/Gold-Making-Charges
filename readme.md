# Gold Making Charge Calculator 🥇

<div align="center">
  <p>A simple web application to help you uncover the exact making charge amount and percentage hidden in your gold jewelry bills.</p>
  
  [![Live Demo](https://img.shields.io/badge/Demo-Live%20Now-success?style=for-the-badge&logo=github)](https://brittotprince.github.io/Gold-Making-Charges/)
</div>

---

Jewelers in India typically calculate the final price of an ornament using the gold value, making charges, and a flat 3% GST. This calculator reverse-engineers that math so you know exactly what you're paying for.

## ✨ Features
* **Real-time Math:** Calculates the making charges instantly as you type.
* **Bug-Free Decimals:** Safely handles decimal inputs without the cursor jumping around.
* **Mobile Friendly:** Fully responsive design that looks great on phones and desktops.

## 🧮 The Math Behind It
1. **Gold Value:** `Weight × Local Gold Rate per gram`
2. **Base Price (pre-tax):** `Total Price / 1.03` *(Removes the 3% GST)*
3. **Making Charge (Amount):** `Base Price - Gold Value`
4. **Making Charge (%):** `(Making Charge Amount / Gold Value) × 100`

---
*Created to help buyers make informed decisions when purchasing gold jewelry.*