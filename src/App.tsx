import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';


/*
  Issue11: 
    TODO
    - Start with a hardcoded limit of 10 seconds
    - Display the number of seconds left
    - Have the number of seconds left get updated
    - When the timer hits zero, tell the user they ran out of time
    - Allow the user to set a custom time duration

    Problemitas
    - Need to remove the input field & ability to check answer once time has elapsed... 
      Choice => Should I stop displaying these & or freeze their access to change state
    - Need to insulate <CountDown /> from state changes... 
      => Try changing dependencies to timeRem
*/


//Set upper and lower bounds used to generate random numbers for quiz questions
let lowerBound = 0;
let upperBound = 10;

//Generate 2 random numbers within lowerBound-upperBound
const num1 = genRandNum(lowerBound, upperBound);
const num2 = genRandNum(lowerBound, upperBound);
//hardcode default time limit per question if user doesn't provide a custom time duration
let timeLimit = 10;


//Get settings from user then render the quiz, finally display results to user
function App() {
  //timeLimit is hardcoded as 10 by default but can be changed by user in the <EnterSettings> component
  const [timeLimit,setTimeLimit] = useState(10);
  //paramsEntered
  const [doneSettings, setDoneSettings] = useState(false);

  return (
    <div className="App">
      <div className="App-header">
        {/*Once settings have been entered, then start the quiz*/}
        {!doneSettings 
          ? <EnterSettings timeLimit={timeLimit} setTimeLimit={setTimeLimit} setDoneSettings={setDoneSettings}/>
          : <Quiz /> 
        }
        {/*To IMPLEMENT: Once quiz has been completed: display results*/}
        
      </div>
    </div>
  )
}

//NOT IMPLEMENTED
//SetLimit() will allow the user to select a custom time limit other than 10s
//Need to decide whether to stall displaying the question etc until user has entered custom time... 
//Could put everything else in a separate component that isn't rendered until custom time limit has been entered
function EnterSettings(props: {timeLimit: number, setTimeLimit: (n: number) => void, setDoneSettings: (b: boolean) => void}) {
  return (
    <div>
      <h3>Enter Quiz Settings:</h3>
      <label>
        Enter time limit in seconds:
        <input 
          type="text"
          value={props.timeLimit}
          onChange={(e) => {
            Number.isNaN(parseInt(e.target.value)) 
            ? console.log("Invalid non-number character entered into timeLimit field!") 
            : props.setTimeLimit(parseInt(e.target.value));            
            //There is a bug here: can't backspace to empty field when only 1 character left
          }}
        />
      </label>
      <br/><br/>
      <label>
        <input
          type="button"
          value="Start Quiz"
          onClick={(e) => {
            props.setDoneSettings(true);
          }}
        />
          
      </label>

    </div>
  )
}

function Quiz() {
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

        <CountDown timeLimit={timeLimit} setTimeUp={setTimeUp}/>

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


export default App;