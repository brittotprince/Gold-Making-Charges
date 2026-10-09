// Native IndexedDB storage service for Gold Making Charge Calculator
const DB_NAME = 'GoldCalcDB'
const DB_VERSION = 1
const STORE_NAME = 'quotes'

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllQuotes() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      // Sort newest first
      const quotes = (request.result || []).sort((a, b) => b.id - a.id)
      resolve(quotes)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function saveQuote(quote) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const record = {
      ...quote,
      id: quote.id || Date.now(),
      createdAt: quote.createdAt || new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    const request = store.put(record)

    request.onsuccess = () => resolve(record)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteQuote(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve(id)
    request.onerror = () => reject(request.error)
  })
}
