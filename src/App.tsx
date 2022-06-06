import React from 'react';
import './App.css';


/*Issue2: Create UI elements
  Add question
  Add input
  Add button
  Add result message
*/

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
