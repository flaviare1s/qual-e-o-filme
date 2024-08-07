import './GameOver.css'

export function GameOver({ onRestart }) {
  return (
    <div>
      <h1>Game Over!</h1>
      <p>Você perdeu todas as vidas.</p>
      <button onClick={onRestart}>Reiniciar</button>
    </div>
  );
}
