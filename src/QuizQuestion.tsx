import React, { useEffect } from 'react';
import './App.css';
import {useState} from 'react';






export interface QuizQuestionProps {
  num1: number;
  num2: number;
  answerChecked: boolean;
  guess: number|undefined;
  setAnswerChecked: (b: boolean) => void;
  setGuess: (n: number|undefined) => void;
}

export function QuizQuestion(props: QuizQuestionProps) {

  //destructure props
  const {num1,num2,answerChecked,setAnswerChecked,guess,setGuess} = props;
  const viewState = JSON.stringify(props,null,4);
  const stateViewElem = <h1>ViewState: {viewState}</h1>;
  //derive answer from props
  const answer = num1 * num2; 

  //setup handleGuess() function
  //handleGuess will freeze when (done === true) <=> (answer===guess && answerChecked) || timeUp (later)
  function handleGuess(newGuess: number|undefined): void {
    if (answerChecked && answer===guess) { //later add timeUp
    console.log("freeze guess field!!");
    } else {
      console.log("handleGuess() called:")
      setGuess(newGuess);
    }
  };



  /*CONTROL FLOW:
  Always  
    - Question
  Scenario 1 <=> (!answerChecked) 
    - Guess
    - AnswerButton
  Scenario 2.1 <=> (answerChecked && !correctAnswer)
    - Guess
    - DisplayResult

  Scenario 2.2 <=> (answerChecked && correctAnswer)...... 
    => Either a brief delay then next question or will have to click 'next' button
    - Guess with handleGuessFrozen()
    - DisplayResult

    3 forms of QuizQuestion (1) Field + Button 

  */

  return (
    <div>
        {stateViewElem}
        {/*Question:*/}
        <Question num1={num1} num2={num2}/>

        <Guess guess={guess} handleGuess={handleGuess}/>

        {/*Check answer button*/}
        {!answerChecked && <AnswerButton setAnswerChecked={setAnswerChecked}/>  }

        {/*If (answerChecked) then: replace AnswerButton => with DisplayResult
          (2) if (guessedCorrect) Freeze the guess input field (by replacing Guess with GuessFrozen)*/}
        {answerChecked && <DisplayResult correct={guess===answer}/>}  
    </div>
  );
}

/* 
          {guess!==answer && (<Guess guess={guess} handleGuess={handleGuess}/>)}
          {guess===answer && (<GuessFrozen guess={guess} />)}
*/


function Question(props: {num1: number, num2: number}) {
  return (
    <>
      What is {props.num1} x {props.num2}?
    </>
  )
}

function Guess(props: {guess: number|undefined, handleGuess: (newGuess: number|undefined) => void}) {
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

/*
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
  ##########################################################################################*/


  //export type reactEvent = React.ChangeEvent<HTMLInputElement>;