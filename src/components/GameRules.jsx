import './GameRules.css'

export const GameRules = () => {
  return (
    <div className='rules-wrapper'>
      <div className='rules'>
          <h2>Regras do Jogo</h2>
              <ul>
                <li>Tente adivinhar o nome do filme.</li>
                <li>Você tem direito a cinco dicas.</li>
                <li>A cada palpite errado, você perde uma vida.</li>
                <li>Cuidado, você só tem dez vidas.</li>
                <li>Você recebe mais pontos se usar menos dicas.</li>
                <li>Escreva o nome dos filmes corretamente, colocando a acentuação.</li>
                <li>Boa sorte e vamos começar!</li>
              </ul>
        </div>
    </div>
  )
}
