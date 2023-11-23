import './GameRules.css'

export const GameRules = () => {
  return (
    <div className='rules'>
        <h2>Regras do Jogo</h2>
            <p>Tente adivinhar o nome do filme.</p>
            <p>Você tem direito a cinco dicas.</p>
            <p>A cada palpite errado, você perde uma vida.</p>
            <p>Cuidado, você só tem dez vidas.</p>
            <p>Você recebe mais pontos se usar menos dicas.</p>
            <p>Escreva o nome dos filmes corretamente.</p>
            <p>Boa sorte e vamos começar!</p>
    </div>
  )
}

