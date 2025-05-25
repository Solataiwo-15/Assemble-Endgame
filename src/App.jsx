import { useState} from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {

  //State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  //Derived values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = 
    guessedLetters.filter(letter =>  !currentWord.includes(letter)).length

  const isGameWon =
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessedLetterIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  console.log(isLastGuessedLetterIncorrect);
  
  //Static values
  const alphabets = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
    setGuessedLetters(prevGuessedLetters => 
      prevGuessedLetters.includes(letter) ? 
        prevGuessedLetters :
        [...prevGuessedLetters, letter]
    )
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languagesElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    }
const className = clsx("chip", isLanguageLost && "lost")

    return (
      <span 
        className = {className}
        style = {styles}
        key = {lang.name}
      >
        {lang.name}
      </span>
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter",
    )
    return (
      <span key={index} className = {letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
})

  const keyboardElements = alphabets.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    })
    

    return(
      <button
        className={className} 
        key={letter} 
        disabled= {isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label = {`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })
  

  const gameStatusClass = clsx("game-status", {
    won : isGameWon,
    lost : isGameLost,
    farewell : !isGameOver && isLastGuessedLetterIncorrect
  })

  function renderGameStatus () {
    if (!isGameOver && isLastGuessedLetterIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } 
    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better luck next time! 😢</p>
        </>
      )
    }
    return null
  }

  return (
    <main>
      {
        isGameWon && 
          <Confetti
            recycle={false}
            numberOfPieces={1000}
          />
      }
      <header>
         <h1>
            Assembly Endgame
          </h1>
         <p>
            Guess the word within 8 attempts to keep the 
            programming world safe from Assembly!
         </p>
      </header>

      <section 
        aria-live="polite" 
        role="status"
        className={gameStatusClass}
      >
          {renderGameStatus()}
      </section>

      <section className="language-chips">
        {languagesElements}
      </section>

      <section className="word">
        {letterElements}
      </section> 
      
      {/* Combined visually-hidden aria-live region for status updates */}
      <section 
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuessedLetter) 
            ? `Correct! The letter ${lastGuessedLetter} is in the word!` 
            : `Sorry! The letter ${lastGuessedLetter} is not in the word!`
          }
          You have ${numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter => 
        guessedLetters.includes(letter) ? letter + "." : "blank.")
        .join(" ")}</p>

      </section>

      <section className="keyboard">
        {keyboardElements} 
      </section>

      {isGameOver && 
        <button 
          onClick = {startNewGame}
          className="new-game"
        >New Game
      </button>}
    </main>
  )
}
