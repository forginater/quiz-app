import React, { useEffect } from 'react';
import './App.css';
import {useState} from 'react';


/*
Implementation 1.1: use guessSubmitted
  - Try not to change QuizQuestion
  - When (guessLocal && answerChecked) , call props.setGuessSubmitted(value: number) {...} to synchronise guessLocal with guessSubmitted in BattleField
  - Do the boolean processing of the outcome in BattleField.... 
  -   PROS: (1) can record the guesses and display them at the end (2) Can put the logic in BattleField

  NOTES: Put the hadlesGuyess
*/



export function QuizQuestion(props: {num1: number, num2: number, setGuessSubmitted: (x: number|undefined) => void, setAlt: (x: number|undefined) => void}) {
  
  const [guessField,setGuessField] = useState<number|undefined>();
  const [answerChecked, setAnswerChecked] = useState(false);
  const answer = props.num1 * props.num2;

  
 


  //handleGuess() both in local guessField & push this result to guessSubmitted in parent component if (answerChecked)
  const handleGuess = (newGuess: any): void => {
    //if newGuess is NaN (when empty) or undefined (uninitialised)
    if (Number.isNaN(parseInt(newGuess))) {
      setGuessField(undefined);
      answerChecked && props.setGuessSubmitted(undefined);
    } 
    //If newGuess is valid
    else {
      setGuessField(parseInt(newGuess));
      answerChecked && props.setGuessSubmitted(newGuess);
    }
  }

  //Kinda works:
  //Unlike other handler, it updates immediately with current guessField value if click AnswerButton, however, if select all text and delete
  //then SetAll keeps some of its values, it's not properly synced and seems to selectively be getting stale data.
  const syncHandler = () => {
    console.log("guessField: ", guessField);
    if (Number.isNaN(guessField)) {
      props.setAlt(undefined);
    } else {
      props.setAlt(guessField);
    }
    
  }

  return (

    <div>
      <h1>**GuessField: {JSON.stringify(guessField,null,4)}</h1>

        {(answerChecked) && <Synchronise syncHandler={syncHandler} guessField={guessField} /> }
        
        <SubmitWithEnter />
        {/*Question:*/}
        <Question num1={props.num1} num2={props.num2}/>

        {/*Check answer button*/}
        {!answerChecked && (
          <>  
            <Guess guessField={guessField} handleGuess={handleGuess} />
            <AnswerButton setAnswerChecked={setAnswerChecked}/> 
          </>
        )}

        {/*If (answerChecked) then:
          (1) replace AnswerButton => with DisplayResult
          (2) if (guessedCorrect) Freeze the guessField input field (by replacing Guess with GuessFrozen)*/}
        {answerChecked && 
        <>
            {guessField!==answer && (
              <Guess guessField={guessField} handleGuess={handleGuess}/>)}
            {guessField===answer && (   
              <GuessFrozen guessField={guessField}   />)}

          <DisplayResult correct={guessField===answer
            }/>
        </>}  
    </div>
  );
}


function Synchronise(props: {syncHandler: any, guessField: any}) {
  console.log("Synchronise Rendered!!");
  props.syncHandler();

  return <>{props.guessField}Hello</>
}

function Question(props: {num1: number, num2: number}) {
  return (
    <>
      What is {props.num1} x {props.num2}?
    </>
  )
}

function Guess(props: {guessField: number|undefined, handleGuess: (e: any) => void} ) {
  return (
    <div>
      <input 
        className = "text-center"
        type="number"
        value={props.guessField ?? ''}
        onChange={(e) => {
          props.handleGuess(e.target.value);
        }}
      />
    </div>
  )
}

function GuessFrozen(props: {guessField: number|undefined}) {
  return (
    <div>
      <input 
        className = "text-center"
        type="number"
        value={props.guessField ?? ''}
        onChange={() => {console.log()}}
      />
    </div>
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



//Allows submission with Enter key
//Proposition: CheckAnswer button & Enter key both submit the answer, can record number of attempts
//Then store the visible local guess in guessField, & push up to guessesSubmitted whenever user hits Enter or clicks AnswerButton.... 
function SubmitWithEnter() {
  
  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
        event.preventDefault();
        // callMyFunction();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);
  return (<></>)
}

/*
SOLUTION1 => BROKEN
INTERESTING ISSUE WITH STATE LAGGING WHEN ENTER ONLY ONE CHARACTER THEN BACKSPACE NO UPDATE UNLESS MORE THAN 1 CHARACTER ENTERED
  //handle guessField locally
  const handleGuessField = (newGuess: any) => {
    if (isNaN(parseInt(newGuess))) {
      setGuessField(undefined);
    } else {
      setGuessField(parseInt(newGuess));
    }
  }

  //handle pushing guessSubmitted up to <BattleField> 
  const submitGuess = (newGuess: any) => {
    if (guessField || answerChecked) {
      isNaN(parseInt(newGuess)) ? props.setGuessSubmitted(undefined) : props.setGuessSubmitted(newGuess);
    }
  }

  //Combine both guessHandler
  const handleGuessOld = (newGuess: any): void => {
    handleGuessField(newGuess);
    submitGuess(newGuess);
    setTimeout(() => submitGuess(newGuess),50);
  }
*/

/* 
SOLUTION2: DOESN't EVEN UPDATE AT ALL!!

*/


 /*
  //handleGuess() updates the guessField value when a new value is inputted
  //If the guessField is correct && AnswerButton has been clicked, then props.setGuessedCorrect is called
  //CONCERN: this guessHandler is a bit ugly and it's possibly muddling up separation of concerns 
  function handleGuess(newGuess: number) {
    //setGuessField: (n:number|undefined) => void
    console.log("handleGuess() called:")
    setGuessField(newGuess);
    if (newGuess===answer) { 
      console.log("INNER CONDITION: setGuessedCorrect(true)\n   => answerChecked: ",answerChecked,'\n   => guessField: ',guessField,'\n   => newGuess: ',newGuess);
      props.setGuessedCorrect(true);
    }
    //PROBLEM: unable to check (newGuess===answer && answerChecked).... Problem outlined in notes at bottom of file
  }
  */

/*##########################################################################################
//Notes on handleGuess() issue of:
//original condition to update newGuess (newGuess===answer && answerChecked) 
    //However, this is undermined by the issue of stale data as answerChecked won't be updated until after the instance of QuizQuestion() that
    //is calling handleGuess()
    //if answerChecked clicked on wrong answer, then correct answer entered, possible to get both values
    //However, if click on CheckAnswer, with correct answer entered into guessField, then answerChecked will be stuck on false (according to this stale render)
##########################################################################################*/



//export type reactEvent = React.ChangeEvent<HTMLInputElement>;