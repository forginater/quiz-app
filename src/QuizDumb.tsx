import React from 'react';
import './App.css';
import {useState} from 'react';


/*
  Issue5: 
    - Get value from input box
    - Check if matches answer
*/



function QuizDumb(props: {num1: number, num2: number}) {
  const answer = props.num1 * props.num2;
  const [guess,setGuess] = useState<number|undefined>();
  const [answerChecked,setAnswerChecked] = useState(false);
  

  return (
    <div className="App">
      <header className="App-header">

      <h3>Dumb Quiz:</h3>

        {/*Question:*/}
        <Question num1={props.num1} num2={props.num2}/>

        {/*Answer field*/}
        <Guess guess={guess} setGuess={setGuess}/>

        {/*Check answer button*/}
        <AnswerButton setAnswerChecked={setAnswerChecked}/>

        {/*Result of answer*/}
        {answerChecked && (
          <DisplayResult correct={guess===answer}/>    
          )
        }
        
        
      </header>
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



export default QuizDumb;