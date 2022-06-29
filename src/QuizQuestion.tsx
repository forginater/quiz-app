import React, { useEffect } from 'react';
import './App.css';
import {useState} from 'react';


/*
  Issue5: 
    - Get value from input box
    - Check if matches answer
*/
export type reactEvent = React.ChangeEvent<HTMLInputElement>;


export function QuizQuestion(props: {num1: number, num2: number, setGuessedCorrect: any}) {
  
  const [guess,setGuess] = useState<number|undefined>();
  const [answerChecked, setAnswerChecked] = useState(false);
  const answer = props.num1 * props.num2;

  
  //handleGuess() updates the guess value when a new value is inputted
  //If the guess is correct && AnswerButton has been clicked, then props.setGuessedCorrect is called
  //CONCERN: this guessHandler is a bit ugly and it's possibly muddling up separation of concerns 
  function handleGuess(newGuess: number) {
    //setGuess: (n:number|undefined) => void
    console.log("handleGuess() called:")
    setGuess(newGuess);
    if (newGuess===answer) { 
      console.log("INNER CONDITION: setGuessedCorrect(true)\n   => answerChecked: ",answerChecked,'\n   => guess: ',guess,'\n   => newGuess: ',newGuess);
      props.setGuessedCorrect(true);
    }
    //PROBLEM: unable to check (newGuess===answer && answerChecked).... Problem outlined in notes at bottom of file
  }

  return (

    <div>
        {/*Question:*/}
        <Question num1={props.num1} num2={props.num2}/>

        {/*Check answer button*/}
        {!answerChecked && (
          <>  
            <Guess guess={guess} handleGuess={handleGuess}/>
            <AnswerButton setAnswerChecked={setAnswerChecked}/> 
          </>
        )}

        {/*If (answerChecked) then:
          (1) replace AnswerButton => with DisplayResult
          (2) if (guessedCorrect) Freeze the guess input field (by replacing Guess with GuessFrozen)*/}
        {answerChecked && 
        <>
          {guess!==answer && (<Guess guess={guess} handleGuess={handleGuess}/>)}
          {guess===answer && (<GuessFrozen guess={guess} />)}
          <DisplayResult correct={guess===answer}/>
        </>}  
    </div>
  );
}




function Question(props: {num1: number, num2: number}) {
  return (
    <>
      What is {props.num1} x {props.num2}?
    </>
  )
}

function Guess(props: {guess: number|undefined, handleGuess: (newGuess: number) => void}) {
  return (
    <div>
      <input 
        className = "text-center"
        type="number"
        value={props.guess ?? ''}
        onChange={(event) => {
          props.handleGuess(parseInt(event.target.value));
          //props.setGuess(parseInt(e.target.value));
            //setGuess: (n:number|undefined) => void}
          //Note the weird error messages in console if type number, then clear field
        }}
      />
    </div>
  )
}

function GuessFrozen(props: {guess: number|undefined}) {
  return (
    <div>
      <input 
        className = "text-center"
        type="number"
        value={props.guess ?? ''}
        onChange={() => {console.log()}}
      />
    </div>
  )
}

function AnswerButton(props: {setAnswerChecked: (b:boolean) => void}) {
  return (
    <>
      <label>

        <input 
          type="button"
          value="Check answer:"
          onClick={(e) => {
            props.setAnswerChecked(true);
          }}
        />
      </label>
    </>
  )
}

function DisplayResult(props: {correct: boolean}) {
  return (
    <>
      {props.correct ? 'Correct!' : 'Wrong!'}
    </>
  )
}




/*##########################################################################################
//Notes on handleGuess() issue of:
//original condition to update newGuess (newGuess===answer && answerChecked) 
    //However, this is undermined by the issue of stale data as answerChecked won't be updated until after the instance of QuizQuestion() that
    //is calling handleGuess()
    //if answerChecked clicked on wrong answer, then correct answer entered, possible to get both values
    //However, if click on CheckAnswer, with correct answer entered into guess, then answerChecked will be stuck on false (according to this stale render)
##########################################################################################*/