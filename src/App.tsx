import React from 'react';
import './App.css';
import {useState} from 'react';


/*
  Issue5: 
    - Get value from input box
    - Check if matches answer
*/

  //Set upper and lower bounds
  let lowerBound = 0;
  let upperBound = 10;
  //Generate 2 random numbers within lowerBound-upperBound
  const num1 = genRandNum(lowerBound, upperBound);
  const num2 = genRandNum(lowerBound, upperBound);

function App() {
  const [answer, SetAnswer] = useState(num1 * num2);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [guess,setGuess] = useState<number | undefined>();
  

  return (
    <div className="App">
      <header className="App-header">

        {/*Question:*/}
        <Question num1={num1} num2={num2}/>

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