// Web Audio API synthesized metallic gold coin clink (zero external dependencies)
let audioCtx = null

export function playCoinClink() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    if (!audioCtx) {
      audioCtx = new AudioContextClass()
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const now = audioCtx.currentTime

    // Fundamental frequencies for a high-resonance gold coin chime
    const freqs = [2600, 3920, 5200]
    const gains = [0.22, 0.12, 0.05]

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      // Slight frequency drop on strike mimics physical vibration
      osc.frequency.exponentialRampToValueAtTime(freq * 0.985, now + 0.35)

      // Sharp strike attack and sweet metallic decay
      gainNode.gain.setValueAtTime(gains[idx], now)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.38)

      osc.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      osc.start(now)
      osc.stop(now + 0.4)
    })
  } catch (err) {
    // Graceful fallback for environments with blocked audio
    console.debug('Audio playback error:', err)
  }
}
