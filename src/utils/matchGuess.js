// Comparação flexível de palpites: ignora maiúsculas, acentos, pontuação,
// espaços extras e o artigo inicial. Assim "origem", "A Origem" e "a  ORIGEM!"
// batem com o título "A Origem".

const ARTICLES = new Set([
  // português
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  // inglês ('a' já está acima)
  'the', 'an',
])

export const normalizeTitle = (value) => {
  const base = String(value)
    .normalize('NFD') // separa letra e acento
    .replace(/[̀-ͯ]/g, '') // remove os acentos (combining marks)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // pontuação/símbolos viram espaço
    .replace(/\s+/g, ' ')
    .trim()

  const words = base.split(' ')
  // Só remove o artigo inicial se sobrar mais alguma palavra.
  if (words.length > 1 && ARTICLES.has(words[0])) {
    words.shift()
  }
  return words.join(' ')
}

export const isCorrectGuess = (guess, title) =>
  normalizeTitle(guess) === normalizeTitle(title)

// Aceita o palpite se ele bater com qualquer um dos títulos (ex.: o título em
// português E em inglês do mesmo filme), independente do idioma selecionado.
export const isCorrectGuessAny = (guess, titles) =>
  titles.some((title) => isCorrectGuess(guess, title))
