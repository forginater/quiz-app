import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import { EnterSettings } from './EnterSettings';


/*
  Issue11: 
    TODO
    - Start with a hardcoded limit of 10 seconds
    - Display the number of seconds left
    - Have the number of seconds left get updated
    - When the timer hits zero, tell the user they ran out of time
    - Allow the user to set a custom time duration
*/






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
        {/*to Implement: add in ability to custom enter lowerBound, upperBound & numQuestions*/}
        {!doneSettings 
          ? <EnterSettings timeLimit={timeLimit} setTimeLimit={setTimeLimit} setDoneSettings={setDoneSettings}/>
          : <Quiz timeLimit={timeLimit}/> 
        }
        {/*To IMPLEMENT: Once quiz has been completed: display results*/}
        
      </div>
    </div>
  )
}





export default App;