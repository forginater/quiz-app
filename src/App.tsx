import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import { EnterSettings } from './EnterSettings';
import { BattleField } from './BattleField';






//Get settings from user then render the quiz, finally display results to user
function App() {
  //timeLimit is hardcoded as 10 by default but can be changed by user in the <EnterSettings> component
  const [timeLimit, setTimeLimit] = useState<number>(5);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  //const [upperBound, setUpperBound] = useState<number>(1);
  //const [lowerBound, setLowerBound] = useState<number>(10);

  //startClicked toggled once user has entered (valid) settings & presses <StartButton>
  //if the settings are invalid a warning message will be displayed in <StartButton>
  const [startClicked, setStartClicked] = useState<boolean>(false)
  //validateSettings used by <StartButton> to make sure timeLimit & numQuestions have valid input values, this is used by 
  const settingsValid = !Number.isNaN(timeLimit) && !Number.isNaN(numQuestions);


  return (
    <div className="App">
      <div className="App-header">
        {/*Once settings have been entered, then start the quiz*/}
        {/*to Implement: add in ability to custom enter lowerBound, upperBound & numQuestions*/}


        {!startClicked && 
        <>
            <EnterSettings 
              timeLimit={timeLimit} 
              numQuestions={numQuestions}
              setTimeLimit={setTimeLimit} 
              setNumQuestions={setNumQuestions}
            />
            <StartButton setStartClicked={setStartClicked} validateSettings={settingsValid} />
        </>
        }
        {startClicked && <BattleField timeLimit={timeLimit} numQuestions={numQuestions} />}
        {/*To IMPLEMENT: Once quiz has been completed: display results*/}
        
      </div>
    </div>
  )
}

export default App;

function StartButton(props: {setStartClicked: (b: boolean) => void, validateSettings: boolean}) {
  const [startAttemptRejected, setStartAttemptRejected] = useState(false);
  
  return (
    <div>
      <input 
        type="button"
        value="Start Quiz"
        onClick={(e) => {
          if (props.validateSettings) {
            props.setStartClicked(true);
          } else {
            console.log("Please enter an integer timeLimit > 0 & numQuestions > 0!");
            setStartAttemptRejected(true);
          }
          
        }}
      />
      <br/>
      {startAttemptRejected && <p>Quiz Settings invalid: please enter positive integer values then try again!</p>}
    </div>
  )
}



