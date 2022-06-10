import React from 'react';
import './App.css';


/*Issue3: 
Randomly generate 2 integers within a certain range
*/






function App() {
  testRandFunc();
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