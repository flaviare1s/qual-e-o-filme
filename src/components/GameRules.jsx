import './GameRules.css'

export const GameRules = () => {
  return (
    <div className='rules'>
        <h2>Game Rules</h2>
            <p>Try to guess the name of the movie.</p>
            <p>I'll give you five tips.</p>
            <p>With every wrong guess you lose a life.</p>
            <p>Be careful, you only have ten lives.</p>
            <p>You earn a higher score when you use fewer hints.</p>
            <p>Good luck and let's get started!</p>
    </div>
  )
}

