import React from 'react';
import './App.css';
import {useState} from 'react';


/*
  Issue5: 
    - Get value from input box
    - Check if matches answer
*/



export function QuizQuestion(props: {num1: number, num2: number}) {
  
  const [guess,setGuess] = useState<number|undefined>();
  const [answerChecked, setAnswerChecked] = useState(false);
  //const [correctamundo, setCorrectamundo ] = useState();
  //const [quizDone]
  const answer = props.num1 * props.num2;

  


  return (

    <div>
      <h3>Dumb Quiz:</h3>

        {/*Question:*/}
        <Question num1={props.num1} num2={props.num2}/>

        {/*Check answer button*/}
        {!answerChecked && (
          <>  
            <Guess guess={guess} setGuess={setGuess}/>
            <AnswerButton setAnswerChecked={setAnswerChecked}/> 
          </>
        )}

        {/*If (answerChecked) then:
          (1) replace AnswerButton => with DisplayResult
          (2) if (guessedCorrect) Freeze the guess input field (by replacing Guess with GuessFrozen)
        */}
        {answerChecked && 
        <>
          {guess!==answer && (<Guess guess={guess} setGuess={setGuess}/>)}
          {guess===answer && (<GuessFrozen guess={guess} />)}
          <DisplayResult correct={guess===answer}/>
        </>}  
    </div>
  );
}

/* 
        
        {answerChecked && 
          <>
            {(!guessCorrect) && <><Guess guess={guess} setGuess={setGuess}/></>}
            {(guessCorrect) && (<>
            <GuessFrozen guess={guess} />
            <DisplayResult correct={guessCorrect}/>
            </>)}
            
          </>}
*/

//Check answer => display result
//if correct answer => freeze field
//(!answerChecked) => Guess & AnswerButton
//(answerChecked && Incorrect) => Guess & Result
//(answerChecked && Correct) => Freeze & Result

function Question(props: {num1: number, num2: number}) {
  return (
    <>
      What is {props.num1} x {props.num2}?
    </>
  )
}

function Guess(props: {guess: number | undefined, setGuess: (n:number|undefined) => void}) {
  return (
    <div>
      <input 
        className = "text-center"
        type="number"
        value={props.guess ?? ''}
        onChange={(e) => {
          props.setGuess(parseInt(e.target.value));
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
