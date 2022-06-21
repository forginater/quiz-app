import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import { EnterSettings } from './EnterSettings';







//Get settings from user then render the quiz, finally display results to user
function App() {
  //timeLimit is hardcoded as 10 by default but can be changed by user in the <EnterSettings> component
  const [timeLimit, setTimeLimit] = useState<number>(10);
  //paramsEntered
  const [doneSettings, setDoneSettings] = useState(false);


  return (
    <div className="App">
      <div className="App-header">
        {/*Once settings have been entered, then start the quiz*/}
        {/*to Implement: add in ability to custom enter lowerBound, upperBound & numQuestions*/}
        {!doneSettings && <EnterSettings timeLimit={timeLimit} setTimeLimit={setTimeLimit} setDoneSettings={setDoneSettings}/>}
        {doneSettings && <Quiz timeLimit={timeLimit}/>}
          
        
        {/*To IMPLEMENT: Once quiz has been completed: display results*/}
        
      </div>
    </div>
  )
}

export default App;