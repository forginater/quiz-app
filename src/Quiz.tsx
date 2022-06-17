import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';

//Set upper and lower bounds used to generate random numbers for quiz questions
let lowerBound = 0;
let upperBound = 10;

//Generate 2 random numbers within lowerBound-upperBound
const num1 = genRandNum(lowerBound, upperBound);
const num2 = genRandNum(lowerBound, upperBound);

export function Quiz(props: {timeLimit: number}) {
    const [answer, SetAnswer] = useState(num1 * num2);
    const [guess, setGuess] = useState<number | undefined>();
    //answerChecked toggled once user clicks <AnswerButton> 
    const [answerChecked, setAnswerChecked] = useState(false);
    //timeUp toggled once time limit has elapsed in <CountDown>
    const [timeUp,setTimeUp] = useState(false);
  
    return (
      <div className="App">
          <br/>
          <h3>Your Suffering has just begun!</h3>
  
          {/*Question:*/}
          <Question num1={num1} num2={num2}/>
  
          <CountDown timeLimit={props.timeLimit} setTimeUp={setTimeUp}/>
  
          {/*Answer field*/}
          <Guess guess={guess} setGuess={setGuess}/>
  
          {/*Check answer button*/}
          {/*Keep Rendering until Check button clicked or timeUp*/}
          {(!answerChecked && !timeUp) && 
            <AnswerButton setAnswerChecked={setAnswerChecked}/>
          }
          
  
          {/*Display result of answer*/}
          {/*Render */}
          {(answerChecked || timeUp) && (
            <DisplayResult correct={guess===answer}/>    
            )
          }
          
      </div>
    );
  }
  
  //CountDown runs and displays a timer that counts down from props.timeLimit until it reaches 0
  //when timeRem reaches 0, it displays "Time Ran Out" and invokes props.setTimeUp(true) to signal to its parent component that the timer has finished
  function CountDown(props: {timeLimit: number, setTimeUp: (n: boolean) => void}) {
    const [timeRem, setTimeRem] = useState(props.timeLimit);
    const setTimeUp = props.setTimeUp;
  
    useEffect(() => {
      console.log("useEffect called with timeRem = ", timeRem);
      setTimeout(() => {
        if (timeRem > 0) {
          setTimeRem((timeRem) => timeRem - 1);
          console.log("setTimeRem called!");
        } else {
          setTimeUp(true);
        }
      },1000)
      return () => clearTimeout();
    },[timeRem,setTimeUp]); //Had to destructure props outside of useEffect and add to dependency array in order to get rid of warning
    return (
      <div>
        {timeRem > 0
          ? <>Time Remaining: {timeRem} seconds</>
          : <>Time ran out</>
        }
      </div>
    )
  }
  
  
  
  function Guess(props: {guess: number|undefined, setGuess: (n:number|undefined) => void}) {
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
  
  function Question(props: {num1: number, num2: number}) {
    return (
      <>
        What is {props.num1} x {props.num2}?
      </>
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
  
  
  //genRandNum() generates a random integer in the inclusive range between 'min' and 'max'
  function genRandNum(min: number, max: number): number {
    //delta = magnitude of the range from min to max 
    const delta = max-min;
    //Generate a random floating-point num in range 0 (inclusive) to 1 (excluding)
    const randNum = Math.random();
    //Scale randNum to fall within delta range
    const randScaled = randNum * (delta + 1);
    //translate randScaled so it's in the range between min and max
    const randTranslated = randScaled + min;
    //round down to integer
    const floored = Math.floor(randTranslated);
    return floored;
  }
  
  //Test genRandNum() to confirm numbers fall within range
  function testRandFunc() {
   for (let i=0; i<30; i++) {
    console.log(i,": ",genRandNum(0,10));
   }
  }