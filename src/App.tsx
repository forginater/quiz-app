import React from 'react';
import './App.css';


/*Issue3: 
Randomly generate 2 integers within a certain range
*/

//genRandNum() generates a random integer in the inclusive range between 'min' and 'max'
function genRandNum(min: number, max: number): number {
  //delta = magnitude of the range from min to max
  const delta = min-max;
  //Generate a random floating-point num in range 0 (inclusive) to 1 (excluding)
  const randNum = Math.random();
  //Scale randNum to fall within delta range
  const randScaled = randNum * delta;
  //translate randScaled so it's in the range between min and max
  const randTranslated = randScaled + min;
  //round down to integer
  const floored = Math.floor(randTranslated);
  return floored;
}

export function genRandInclusiveRange(min: number, max: number) {
  //delta has same magnitude as range but relative to 1
  const delta = max-min; //Maybe need to add 1
    //The Math.random() function returns a floating-point, random          
    //number in the range from 0 (inclusive) up to but not including 1.
    const initialRand = Math.random();
    //Scale random number so it falls within the delta range (relative to 1)
    const randScaled = initialRand * delta;
    //translating by min shifted randShifted so it's in the correct range between min (inclusive) & max (exclusive)
    const randShifted = randScaled + min;
    //floored is rounded down to next integer (so it will be inclusive of both min & max values)
    const floored = Math.floor(randShifted);
    return floored;
}


function App() {
  return (
    <div className="App">
      <header className="App-header">

        {/*Question:*/}
        <Question num1={6} num2={7}/>

        {/*Answer field*/}
        <Answer answer={6*7}/>

        {/*Check answer button*/}
        <AnswerButton />

        {/*Result of answer*/}
        <DisplayResult correct={true}/>    
        
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

function Answer(props: {answer: number}) {
  return (
    <div >
      <input 
        className = "text-center"
        type="number"
        value={props.answer}
      />
    </div>
  )
}

function AnswerButton() {
  return (
    <>
      <label>

        <input 
          type="button"
          value="Check answer:"
          onClick={() => console.log("button pressed!")}
        />
      </label>
    </>
  )
}

function DisplayResult(props: {correct: boolean}) {
  return (
    <>
      {props.correct ? 'Correct!' : 'Incorrect!'}
    </>
  )
}

export default App;

