import React, { useEffect } from 'react';
import './App.css';
import {useState} from 'react';






export interface QuizQuestionProps {
  num1: number;
  num2: number;
  guess: number|undefined;
  answerChecked: boolean;
  setAnswerChecked: (b: boolean) => void;
  handleCheckAnswerButton: () => void;
  handleGuess: (n: number|undefined) => void;
  
}

export function QuizQuestion(props: QuizQuestionProps) {

  //destructure props
  const {num1,num2,answerChecked,setAnswerChecked,handleCheckAnswerButton,guess,handleGuess} = props;

  //derive answer from props
  const answer = num1 * num2; 




  return (
    <div>
        
        
        <hr/>
        {/*Question:*/}
        <Question num1={num1} num2={num2}/>

        <Guess guess={guess} handleGuess={handleGuess}/>

        {/*Check answer button*/}
        {!answerChecked && <AnswerButton handleCheckAnswerButton={handleCheckAnswerButton}/>  }

        {/*If (answerChecked) then: replace AnswerButton => with DisplayResult*/}
        {answerChecked && <DisplayResult correct={guess===answer}/>}  

        
        
        
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

interface GuessProps {guess: number|undefined; handleGuess: (newGuess: number|undefined) => void; }
function Guess(props: GuessProps) {
  return (
    <div>
      <input 
        className = "text-center"
        type="number"
        value={props.guess ?? ''}
        onChange={(event) => {
          props.handleGuess(parseInt(event.target.value));
        }}
      />
    </div>
  )
}

function AnswerButton(props: {handleCheckAnswerButton: () => void}) {
  return (
    <>
      <label>
        <input 
          type="button"
          value="Check answer:"
          onClick={(e) => {
            props.handleCheckAnswerButton();
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

export function ViewState(props: any) {
  const viewState = JSON.stringify(props,null,4);
  return (
    <div>
      <br/>
      <hr/>
      <h3>{viewState}</h3>
      <hr/>
    </div>);
}

export function ViewStateNewLine(props: any) {
  const viewState = JSON.stringify(props,null,'\t');

  return (
    <div>
      <br/>
      <hr/>
      <h3>ViewState: {viewState}</h3>
      <hr/>
    </div>);
}





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

  //use this function to determine QuizQuestion mode
  //Stage1: Virgin, Stage2: Battle, Stage3: Donezies
  //const getDisplayMode = () => answerChecked ? "" //return displayMode() 
  

