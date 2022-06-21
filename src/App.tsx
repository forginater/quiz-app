import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import { EnterSettings } from './EnterSettings';






//Get settings from user then render the quiz, finally display results to user
function App() {
  //timeLimit is hardcoded as 10 by default but can be changed by user in the <EnterSettings> component
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  //startClicked toggled once user has entered settings & is ready to start the quiz
  const [startClicked, setStartClicked] = useState<boolean>(false)
  
  //const [upperBound, setUpperBound] = useState<number>(1);
  //const [lowerBound, setLowerBound] = useState<number>(10);


  //validateSettings checks to make sure timeLimit & numQuestions have valid input values, this is used by 
  let validateSettings = !Number.isNaN(timeLimit) && !Number.isNaN(numQuestions);


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
            <StartButton setStartClicked={setStartClicked} validateSettings={validateSettings} />
        </>
        }
        {startClicked && <Quiz timeLimit={timeLimit}/>}
        {/*To IMPLEMENT: Once quiz has been completed: display results*/}
        
      </div>
    </div>
  )
}

export default App;

function StartButton(props: {setStartClicked: (b: boolean) => void, validateSettings: boolean}) {
  const [rejectStart, setRejectStart] = useState(false);
  
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
            setRejectStart(true);
          }
          
        }}
      />
      <br/>
      {rejectStart && <p>Quiz Settings invalid: please enter positive integer values then try again!</p>}
    </div>
  )
}



/*
interface Settings {
  timeLimit: number;
  numQuestions: number;
  upperBound: number;
  lowerBound: number;
}

const initEntryProps: EnterSettingsProps = {
  timeLimit: timeLimit,
  numQuestions: numQuestions,
  upperBound: upperBound,
  lowerBound: lowerBound
}
*/