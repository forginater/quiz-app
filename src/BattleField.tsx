

import React from 'react';
import './App.css';
import {useState, useEffect, useRef, useMemo} from 'react';
import { Quiz } from './Quiz';
import {genRandNum} from './genRandNum';
import {QuizQuestion, QuizQuestionProps, ViewState, ViewStateNewLine} from './QuizQuestion';
import { count } from 'console';
import { BasicCounter } from './TimerComponents';


/* 
##########################################################################################
TODO:
    - Start with a hardcoded 10 questions
    - Display the user's progress (eg. x / 10 questions)
    - Once the user answers a question successfully, or the timer has elapsed, ask the next one
            => questionDone = guessedCorrectly || timeUp
    - If they got all the questions right, display the results
            => only display results if progress == 10/10
    - Allow user to modify the number of questions asked

STRATEGY:
    - raiseState to BattleField.... Do all the logic in BattleField

TASKS:
    - remove guessedCorect    
    - raise state of [guess, setGuess] & answerChecked
    - define props for BattleField, QuizQuestion
    - update logic
    - sort out timer stopping after correct guess 

INTEGRATE from issue11-post-1.1
    - questionsInit() function to create useState(initial question data)
    - use submitWithEnter() event listener from

LATER: 
    - later: define props for EnterSettings, StartButton
##########################################################################################
*/


export interface BattleFieldProps {
    timeLimit: number;
    numQuestions: number;
    lowerBound: number;
    upperBound: number;
}



//for each individual quiz question, 'Question' interface used to store the numbers used to form the question , the latest guess & the outcome 
interface Question {
    num1: number;
    num2: number;
    //guess: number|undefined;
    //outcome: outcome; //this will be undefined until outcome is recorded <=> questionDone
}

interface Outcomes {
    finalGuess: number|undefined;
    result: "Correct" | "Incorrect" | "TimeUp";
}





/*BattleField() coordinates running multiple questions with time delays and records the results*/

export function BattleField(this: any, props: BattleFieldProps) { 

    //Destructure props
    const {timeLimit,numQuestions,lowerBound,upperBound} = props;

    
    
    //result: push basic result: 'Incorrect', 'Correct', 'TimeUp'
    const [res, setRes] = useState(['']);
    //more substantial results:
    const [outcomes, setOutcomes] = useState();
    //questionsArr contains nested arrays with num1, num2 where questionAnswer = num1 * num2
    const [questionsArr] = useState<Question[]>(() => buildQuestions(numQuestions,lowerBound,upperBound));
    //currentIndex of question being displayed
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    //guess contains the current value displayed on the guess field
    const [guess,setGuess] = useState<number|undefined>();
    //answerChecked is set to true when user clicks checkAnswer button, reset to false when current question is done
    const [answerChecked, setAnswerChecked] = useState(false);

    //timerDone is toggled to true when (timeRem===0) <=> $timeLimit seconds have passed
    const [timerDone, setTimerDone] = useState(false);
    //timeRem: time remaining in the CountDown for user to correctly guess the answer
    const [timeRem, setTimeRem] = useState(props.timeLimit);

    //progress: correct answers 
    const [progress, setProgress] = useState(0);
    //Have all questions been answered yet?
    const [battleDone, setBattleDone] = useState(false);


    //BUSINESS LOGIC:
    //ASSUMPTIONS: GET FUNCTIONS need to be called before QuizQuestions are rendered with next question
    //They base their answer on values that are wiped each new question 
    //so if they are called after updating UI to next question, they will return stale data
    
  


    //get the answer the question corresponding to index in argument
    function getAnswer(index: number) {
        return questionsArr[index].num1 * questionsArr[index].num2;
    }


    function isLastQuestion(index: number) {
        //index of last question occurs @ numQuesstions -1 => 
        return (index === (numQuestions - 1)) ? true : false;
    }

    ////////////////////////////////////////////////////////////
    //UPDATER FUNCTIONS


    //Note: this is only called when timer is prematurely reset by handleUpdate() due to correct answer
    //no need to setTimerDone(true) as the next question would setTimerDone(false) straight afterwards
    function resetTimer() {
        setTimeRem(timeLimit);
    }

    function finishTimer() {
        setTimeRem(0);
    }


    type caller = "Time" | "Check" | "Guess" | "Manual" 
    function handleUpdateManual(caller: caller) {
        console.log("<<<>>> Caller of handleUpdateManual was: ", caller)
        const nextIndex = currentIndex + 1;
        if (!isLastQuestion(currentIndex)) { 
            console.log("NotLastQuestion");
            resetTimer()
            nextQuizQuestionPropsInit();
            setCurrentIndex(nextIndex);
        }
        else { //This is the last question, just updateResults & set battleDone 
            console.log("question");
            finishTimer();
            setBattleDone(true);

        }   
    }



    //Get the current BattleProps based on the current index. Used by handleUpdate() which is invoked by handlers() when questionDone
    function getQuizQuestionProps(index: number) {
        return {
            //Get questions from current question
            num1: questionsArr[index].num1,
            num2: questionsArr[index].num2,
            //Get old values
            guess: guess,
            answerChecked: answerChecked,
            setAnswerChecked: setAnswerChecked,
            handleCheckAnswerButton: handleCheckAnswerButton,
            handleGuess: handleGuess,
        }
    }

    //nextQuizQuestionPropsInit()
    //PURPOSE: Reset state => reinitialise <QuizQuestion> for next question
    function nextQuizQuestionPropsInit() {
        setGuess(undefined);
        setAnswerChecked(false);
        setTimerDone(false);
    }

    ////////////////////////////////////////////////////////////
    //HANDLER FUNCTIONS
    //(for child stateless components)
    //NOTE: atm, successfull outcome = (answerChecked && getAnswer(currentIndex)===guess) || timerDone
    //Therefore, handleTimerDone() will call updateApp() by default, whereas handleGuess() will need to check questionDone()

    

    //handleTimerDone()
    //PURPOSE: setTimerDone(true), call handleUpdateManual then reset Timer
    //If timeUp then 'Incorrect'
    function handleTimerDone() {
        console.log("handleTimerDone() called:");
        setTimerDone(true);
        setTimeRem(timeLimit);
        //Update if: always update if timer has finished with 'Incorrect'
        //setResults([...results,'index #' + currentIndex + ': TIMEUP']);
        setRes([...res,"TimeUp"]);
        handleUpdateManual("Time");
    }

    function handleResult(index: number, checked: boolean, newGuess: number|undefined) {
        const ans = questionsArr[index].num1 * questionsArr[index].num2;
        const outcome = (checked && newGuess===ans) 
            ? 'Correct'
            : 'Incorrect';
        //update progress value if correct answer
        if (outcome === 'Correct') {
            setProgress(prev => prev + 1);
        }
        setRes([...res,'index# ' + index + ': ' + outcome]);

    }
    
    
    //handleGuess() 
    //PURPOSE: Freeze <Guess> & setGuess(newGuess)
    function handleGuess(newGuess: number|undefined): void {
        console.log("handleGuess() called:")
        setGuess(newGuess);
        //update if: checkAnswer button was clicked before newGuess was entered
        const updateNow: boolean = (newGuess !== undefined && (newGuess === getAnswer(currentIndex)) && answerChecked);
        console.log("value of updateNow is: ",updateNow);
        if (updateNow) {
            console.log(">>>>handleGuess() calling handleUpdateManual()");
            handleResult(currentIndex,answerChecked,newGuess);
            handleUpdateManual("Guess");
        }  
    };

    function handleCheckAnswerButton() {
        setAnswerChecked(true);
        //Update if: correct answer was entered before clicking CheckAnswerButton
        const updateNow = (guess === getAnswer(currentIndex));
        if (updateNow) {
            console.log(">>>>checkAnswerButton() calling handleUpdateManual()");
            handleResult(currentIndex,true,guess);
            handleUpdateManual("Check");
        }
    }



    ////////////////////////////////////////////////////////////
    //BattleField return JSX component
    return (
        <>
            <>  
                
                <ViewState  res={res}/>
                
                <ViewState  index={currentIndex}/>
                <ViewState {...props} />
                <ViewState {...questionsArr} />
                <br/>
                <BasicCounter 
                    timeRem={timeRem}
                    setTimeRem={setTimeRem}
                    handleTimerDone={handleTimerDone}
                />
                <br/><br/><br/>

                
                

            </>
                <div>
                    <ManualUpdateButton onClick={handleUpdateManual}/>
                    <br/>
                    <DisplayProgress progress={progress} numQuestions={numQuestions} currentIndex={currentIndex}/>
                    <br/>

                    <QuizQuestion {...getQuizQuestionProps(currentIndex)} />
                    {battleDone && <DisplayHumiliation youAre={"A big dickface boy"}/>}
                    
                </div>
        </>
    )
}

function DisplayHumiliation(props: {youAre: string}) {
    return (
        <>
            What you are: {props.youAre}
        </>
    )
}

//Display the user's progress
function DisplayProgress(props: {progress: number, numQuestions: number, currentIndex: number}) {

    const remainingQuestions = props.numQuestions - props.currentIndex;
    return (
        <>
            <p>Progress: {props.progress} / {props.numQuestions} Correct! </p>
            <p>Remaining: {remainingQuestions} questions </p>
        </>
    )
}



//ManualUpdateButton allows us to manually update to the next question rather than needing Correct answer or timeUp
//TESTING:
function ManualUpdateButton(props: {onClick: any}) { 
    return (
        <label>
            ManualUpdate:
            <input 
                type="button"
                value="ManualUpdate()"
                onClick={(e) => {props.onClick("Manual")}}
            />
        </label>
    )
}


//buildQuestions() builds the initial input for the questionsArr useState hook with numQuestions * Question objects
function buildQuestions(numQuestions: number, lowerBound: number, upperBound: number): Question[] {
    return Array(numQuestions).fill(undefined).map((question) => {
        return {
            num1: genRandNum(lowerBound,upperBound),
            num2: genRandNum(lowerBound,upperBound),
    };
})
}

