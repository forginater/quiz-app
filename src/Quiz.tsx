import React from 'react';
import './App.css';
import {useState, useEffect, useMemo} from 'react';

/*
TODO
- [ ] Fix program logic in \<Quiz\> according to proposal below 
- [ ] Prevent the timer from continuing to count down after the question has been answered
- [ ] 1 second lag between CountDown completing and displaying the answer
- [ ] Fix the CountDown display jumping from 10 to 8 seconds (appears to be about 2 seconds but need to check exact times)
- [ ] Fix inability to backspace to empty field in custom timeLimit

PROGRAM LOGIC
done = answerChecked || timeUp
if (done) => run timer & render guessfield
else => display result, stop timer & freeze guessfield (maintain visible but can't change input field)
*/

//Set upper and lower bounds used to generate random numbers for quiz questions
let lowerBound = 0;
let upperBound = 10;

//Generate 2 random numbers within lowerBound-upperBound
const num1 = genRandNum(lowerBound, upperBound);
const num2 = genRandNum(lowerBound, upperBound);



export function Quiz(props: {timeLimit: number}) {
    //answer <=> true answer
    const [answer, SetAnswer] = useState(num1 * num2);
    //User inputted guess
    const [guess, setGuess] = useState<number | undefined>();
    //answerChecked toggled once user clicks <AnswerButton> 
    const [answerChecked, setAnswerChecked] = useState(false);
    //timeUp toggled once time limit has elapsed in <CountDown>
    const [timeUp, setTimeUp] = useState(false);

    const done = timeUp || answerChecked;

  
    return (
      <div className="App">
          <br/>
          <h3>Your Suffering has just begun!</h3>

          {/*Question:*/}
          <Question num1={num1} num2={num2}/>          

          <CountDown timeLimit={props.timeLimit} setTimeUp={setTimeUp} done={done}/>
      
          {/*After (done) freeze the Guess component, stop displaying the AnswerButton and DisplayResult*/}
          {!done 
            ? (<Guess guess={guess} setGuess={setGuess}/>) 
            : (<GuessFrozen guess={guess}/>)
          }
          
          {!done 
            ? (<AnswerButton setAnswerChecked={setAnswerChecked}/>) 
            : (<DisplayResult correct={guess===answer}/>)
          }
          
          
      </div>
    );
  }
  
  //CountDown runs and displays a timer that counts down from props.timeLimit until it reaches 0
  //when timeRem reaches 0, it displays "Time Ran Out" and invokes props.setTimeUp(true) to signal to its parent component that the timer has finished
  function CountDown(props: {timeLimit: number, done: boolean, setTimeUp: (n: boolean) => void}) {
    const [timeRem, setTimeRem] = useState(props.timeLimit);
    const setTimeUp = props.setTimeUp;
    
    useEffect(() => {
      console.log("useEffect called with timeRem = ", timeRem);
      setTimeout(() => {
        if (!props.done && timeRem > 0) {
          setTimeRem((timeRem) => timeRem - 1);
          console.log("setTimeRem called!");
        } else {
          setTimeUp(true);
        }
      },1000)
      return () => clearTimeout();
    },[props.done, timeRem, setTimeUp]); //Had to destructure props outside of useEffect and add to dependency array in order to get rid of warning
    return (
      <div>
        {timeRem > 0
          ? <>Time Remaining: {timeRem} seconds</>
          : <>Time ran out</>
        }
      </div>
    )
  }

  function CountDownFrozen(props: {timeRem: number}) {
    return (
        <div>
          {props.timeRem > 0
            ? <>Time Remaining: {props.timeRem} seconds</>
            : <>Time ran out</>
          }
        </div>
      )

  }
  
  /*
  function updateGuess(f: (e: any, set: (n: number|undefined) => void) => void): any {
    set.(parseInt(e.target.value));
  }
  */

  function GuessFrozen(props: {guess: number|undefined}) {
    return (
      <div>
        <input 
          className = "text-center"
          type="number"
          value={props.guess ?? ''}
        />
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