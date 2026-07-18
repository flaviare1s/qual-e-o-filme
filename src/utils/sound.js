// SFX sintetizados via Web Audio API — sem arquivos de áudio, sem dependências.
// Todos os sons tocam em resposta a um gesto do usuário, então o AudioContext
// pode ser criado/retomado sem cair no bloqueio de autoplay do navegador.

let ctx
let muted = localStorage.getItem('movieGameMuted') === 'true'

export const isMuted = () => muted

export const setMuted = (value) => {
  muted = value
  localStorage.setItem('movieGameMuted', String(value))
}

const getCtx = () => {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Toca uma nota única com envelope suave (evita cliques).
const tone = (ac, freq, start, duration, { type = 'sine', gain = 0.15 } = {}) => {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(g)
  g.connect(ac.destination)
  const t = ac.currentTime + start
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

// notes: [freq, startOffset, duration, opts?]
const play = (notes) => {
  if (muted) return
  const ac = getCtx()
  if (!ac) return
  notes.forEach(([freq, start, dur, opts]) => tone(ac, freq, start, dur, opts))
}

export const playClick = () => play([[330, 0, 0.06, { type: 'square', gain: 0.05 }]])

// Acerto: arpejo ascendente C5–E5–G5
export const playCorrect = () =>
  play([
    [523.25, 0, 0.14],
    [659.25, 0.1, 0.16],
    [783.99, 0.2, 0.28],
  ])

// Erro: dois tons graves descendentes
export const playWrong = () =>
  play([
    [196, 0, 0.22, { type: 'sawtooth', gain: 0.1 }],
    [155.56, 0.13, 0.28, { type: 'sawtooth', gain: 0.1 }],
  ])

// Vitória: arpejo até a oitava
export const playWin = () =>
  play([
    [523.25, 0, 0.14],
    [659.25, 0.13, 0.14],
    [783.99, 0.26, 0.14],
    [1046.5, 0.39, 0.5],
  ])

// Derrota: acorde descendente melancólico
export const playLose = () =>
  play([
    [440, 0, 0.3, { type: 'triangle', gain: 0.12 }],
    [349.23, 0.2, 0.3, { type: 'triangle', gain: 0.12 }],
    [261.63, 0.4, 0.6, { type: 'triangle', gain: 0.12 }],
  ])

// Fim neutro (chegou ao fim sem vencer): dois tons médios
export const playFinish = () =>
  play([
    [523.25, 0, 0.2, { type: 'triangle', gain: 0.11 }],
    [440, 0.18, 0.4, { type: 'triangle', gain: 0.11 }],
  ])
