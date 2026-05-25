import {useRef, useState} from 'react'
import './App.css'
import "./languages.jsx"
import {languages} from "./languages.jsx";
import clsx from 'clsx'
import {getFarewellText, chooseRandomWord} from "./utilis.jsx";
import Confetti from 'react-confetti'



export default function AssemblyEndgame() {
   
    //State инфа
    const [currentWord, setCurrentWord] = useState(chooseRandomWord());
    const [answer, setAnswer] = useState([]);

    //Derived инфа
    const wrongTriesCount = answer.filter(letter => !currentWord.toUpperCase().includes(letter)).length;
    const isGameWon = currentWord.toUpperCase().split("").every(letter =>
    answer.includes(letter))
    const isGameLost = wrongTriesCount > languages.length - 1
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = answer[answer.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.toUpperCase().includes(lastGuessedLetter)


    //Static инфа
    const alphabet = "abcdefghijklmnopqrstuvwxyz"


    const ourWord = currentWord.toUpperCase().split("").map((letter, index) => {
        let className = ""
        if (isGameWon) {
            className = "winner-letter"
        }
        if (isGameLost) {
            className = "loser-letter"
        }
        return (
            <span key={index} className={className}>
      {isGameLost || answer.includes(letter) ? letter : ""}
    </span>
        )
    })

    function addLetter (letter) {
        setAnswer(prev => prev.includes(letter) ? prev : [...prev, letter])

    }

    const buttons = alphabet.toUpperCase().split('').map((button, index) =>  {
        const isGuessed = answer.includes(button)
        const isCorrect = isGuessed && currentWord.toUpperCase().includes(button)
        const isWrong =  isGuessed && !currentWord.toUpperCase().includes(button)
        const className = clsx("key", {
            correct: isCorrect,
            wrong: isWrong,
        })
        return (
            <button
                key={index}
                className={className}
                disabled={isGameOver}
                aria-disabled={answer.includes(button)}
                aria-label={`Letter ${button}`}
                onClick={() => addLetter(button)}>{button}
            </button>
        )
    })

    const languageElements = languages.map((language, index) => {
        const isLanguageLost = index < wrongTriesCount
        const styles = {
            backgroundColor: language.backgroundColor,
            color: language.color
                        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                key={language.name}
                style={styles}>{
                language.name}
            </span>
        )
    })
    getFarewellText(languages.name)

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function GameStatus () {
        if (!isGameOver && isLastGuessIncorrect) {
           return (
               <p className="farewell-message">
                   {getFarewellText(languages[wrongTriesCount - 1].name)}
               </p>
           )
        }
        if (isGameWon) {
            return  (
                <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
                    <Confetti
                        numberOfPieces="1000"
                    />
            </>
            )
        } if (isGameLost) {
           return (
               <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
           )
        }
        return null
    }

    function StartNewGame () {
        setCurrentWord(chooseRandomWord());
        setAnswer([])
    }



    return (

      <main>
          <header>
            <h2>Assembly: Endgame</h2>
            <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
          </header>

          <section
              aria-live="polite"
              role="status"
              className={gameStatusClass}
          >
              {GameStatus()}
          </section>

          <section className="chips">
              {languageElements}
          </section>

          <section
              className="the-word">
              {ourWord}
          </section>

          <section
              className="sr-only"
              aria-live="polite"
              role="status"
          >
              <p>Current word: {currentWord.split("").map(letter =>
              answer.includes(letter) ?
              letter + "." : "blank.").join(" ")}</p>
          </section>

          <section className="keyboard">
              {buttons}
          </section>

          <button
              className="new-game"
                  onClick={StartNewGame}>New Game</button>
      </main>

  )
}

