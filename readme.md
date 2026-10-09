# Gold Making Charge Calculator 🥇

A simple, standalone web application to help you uncover the exact making charge amount and percentage hidden in your gold jewelry bills. 

Jewelers in India typically calculate the final price of an ornament using the gold value, making charges, and a flat 3% GST. This calculator reverse-engineers that math so you know exactly what you're paying for.

## Features
* **No Installation Required:** Runs entirely in your browser using standard HTML and React/Tailwind CDNs.
* **Real-time Math:** Calculates the making charges instantly as you type.
* **Bug-Free Decimals:** Safely handles decimal inputs (like `10.5` grams) without the cursor jumping around.
* **Mobile Friendly:** Fully responsive design that looks great on phones and desktops.

## How to Run Locally
Since this is a single-file application, you don't need any complex build tools (like Node.js or Webpack).

1. Download or save the `index.html` file to your computer.
2. Double-click the file to open it in any modern web browser (Chrome, Safari, Edge, Firefox).
3. Start calculating!

## How to Share / Host
If you want to share a live link with your friends, you can host this single file for free on platforms like:
* [GitHub Pages](https://pages.github.com/)
* [Vercel](https://vercel.com/)
* [Netlify Drop](https://app.netlify.com/drop) (Just drag and drop the folder containing your `index.html` file)

## The Math Behind It
1. **Gold Value:** `Weight × Local Gold Rate per gram`
2. **Base Price (pre-tax):** `Total Price / 1.03` (Removes the 3% GST)
3. **Making Charge (Amount):** `Base Price - Gold Value`
4. **Making Charge (%):** `(Making Charge Amount / Gold Value) × 100`