

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
export interface Question {
    num1: number;
    num2: number;
    //guess: number|undefined;
    //outcome: outcome; //this will be undefined until outcome is recorded <=> questionDone
}

export interface Outcome {
    finalGuess: number | undefined;
    result: string | undefined;  //"Correct" | "Incorrect" | "TimeUp" | undefined
}

type ZippedTuple = [question: Question, outcome : Outcome];

function DisplayHumiliation(props: {outcomes: Outcome[], questions: Question[]}) {
    //Combine each question/outcome pair a tuple 
    const zippedArr: ZippedTuple[] = props.questions.map((question,indexZip) => {
        return [question,props.outcomes[indexZip]];
    });
    return (
      <>
        <h1>Quiz Completed!!</h1>
        <li>
                {zippedArr.map((res) => <PatheticHumanWeep zip={res} />)}
        </li>
      </>
    )
  }


interface PatheticHumanWeepProps {zip: ZippedTuple;}
function PatheticHumanWeep(props: PatheticHumanWeepProps) {
    const [question,outcome] = props.zip;
    const questStr = `Question: ${question.num1} x ${question.num2} = ${question.num1*question.num2}`;
    
    //Return result of outcome unless undefined
    const validOutcome = outcome.result === 'TimeUp' || outcome.result === 'Incorrect' || outcome.result || 'Correct';
    let resultStr = validOutcome 
        ? `Outcome: ${outcome.result}` 
        : `Something Went Wrong`;

    return ( 
        <dl>
            <dd>
                {questStr} 
            </dd>
            <dd>
                {resultStr}
            </dd>
        </dl>

    )

}

/*BattleField() coordinates running multiple questions with time delays and records the results*/
export function BattleField(this: any, props: BattleFieldProps) { 

    //Destructure BattleFieldProps to improve readability
    const {timeLimit,numQuestions,lowerBound,upperBound} = props;

    //LOCAL STATE:
    //battleCompleted set to true once all questions have been answered or timedOut.. Counter stops & results displayed
    const [battleCompleted, setBattleCompleted] = useState<boolean>(false);
    //result: push basic result: 'Incorrect', 'Correct', 'TimeUp'
    const [res, setRes] = useState(['']);
    //more substantial results:
    const [outcomes, setOutcomes] = useState<Outcome[]>(() => buildOutcomes(numQuestions));
    //questionsArr contains nested arrays with num1, num2 where questionAnswer = num1 * num2
    const [questionsArr] = useState<Question[]>(() => buildQuestions(numQuestions,lowerBound,upperBound));
    //currentIndex of question being displayed
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    //guess contains the last value inputted into and displayed by the Guess function.
    const [guess,setGuess] = useState<number|undefined>();
    //answerChecked is set to true when user clicks checkAnswer button, reset to false when current question is done
    const [answerChecked, setAnswerChecked] = useState(false);
    //timeRem: time remaining in CountDown to answer a specifi QuizQuestion 
    const [timeRem, setTimeRem] = useState(props.timeLimit);
    //progress: number of correct guesses submitted before timer countdown
    const [progress, setProgress] = useState(0);


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
    function resetTimer() {
        setTimeRem(timeLimit);
    }




    type caller = "Time" | "Check" | "Guess" | "Manual" 
    function handleUpdate(caller: caller) {
        console.log("<<<>>> Caller of handleUpdate was: ", caller)
        const nextIndex = currentIndex + 1;
        if (!isLastQuestion(currentIndex)) { 
            console.log("NotLastQuestion");
            resetTimer()
            nextQuizQuestionPropsInit();
            setCurrentIndex(nextIndex);
        }
        else { //This is the last question, updateResults, push to App & set battleDone 
            console.log("question");
            setBattleCompleted(true);

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
    }

    ////////////////////////////////////////////////////////////
    //HANDLER FUNCTIONS
    //(for child stateless components)
    //NOTE: atm, successfull outcome = (answerChecked && getAnswer(currentIndex)===guess) || timerDone
    //Therefore, handleTimerDone() will call updateApp() by default, whereas handleGuess() will need to check questionDone()

    //handleTimerDone()
    //PURPOSE: setTimerDone(true), call handleUpdate then reset Timer
    //If timeUp then 'Incorrect'
    function handleTimerDone() {
        console.log("handleTimerDone() called:");

        setTimeRem(timeLimit);
        //always update if timer, except
        //has finished with 'Incorrect'
        //setResults([...results,'index #' + currentIndex + ': TIMEUP']);
        //Need to check here: if this is final question x: don't need to update
        setRes([...res,"TimeUp"]);
        updateOutcomes(currentIndex, {finalGuess: undefined, result: "TimeUp"})
        handleUpdate("Time");
    }

    //handleResult() called by handleGuess() & handleCheckAnswerButton() to determine outcome and update the store the result
    function handleResult(index: number, checked: boolean, newGuess: number|undefined) {
        const ans = questionsArr[index].num1 * questionsArr[index].num2;
        const newResult = (checked && newGuess===ans) //If
            ? 'Correct'
            : 'Incorrect';
        //update progress value if correct answer
        if (newResult === 'Correct') {
            setProgress(prev => prev + 1);
        }
        //push results to res
        setRes([...res,'index# ' + index + ': ' + newResult]);
        //push results to outcomes
        const newOutcome = {finalGuess: newGuess, result: newResult}
        updateOutcomes(index,newOutcome)
    }

    /*
    interface Outcome {
    finalGuess: number | undefined;
    result: "Correct" | "Incorrect" | undefined; 
    } */
    function updateOutcomes(index: number, newOutcome: Outcome) {
        const clonedOutcomes = outcomes.slice();
        clonedOutcomes[index] = {...newOutcome};
        setOutcomes([...clonedOutcomes]);
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
            handleResult(currentIndex,answerChecked,newGuess);
            handleUpdate("Guess");
        }  
    };

    //handleCheckAnswerButton() is called when CheckAnswer button clicked:
    function handleCheckAnswerButton() {
        setAnswerChecked(true);
        //Update if: correct answer was entered before clicking CheckAnswerButton
        const updateNow = (guess === getAnswer(currentIndex));
        if (updateNow) {
            console.log(">>>>checkAnswerButton() calling handleUpdate()");
            handleResult(currentIndex,true,guess);
            handleUpdate("Check");
        }
    }

    

    //////////////////////////////////
    //BattleField return JSX component
    return (
        <>
            {!battleCompleted && 
                <>  
                    <div>
                        <br/>
                        <BasicCounter 
                            clockRunning={!battleCompleted}
                            timeRem={timeRem}
                            setTimeRem={setTimeRem}
                            handleTimerDone={handleTimerDone}
                        />
                        <br/><br/><br/>
                    </div>

                
                    <div>
                        <br/>
                        <QuizQuestion {...getQuizQuestionProps(currentIndex)} />
                        <br/>
                        <DisplayProgress progress={progress} numQuestions={numQuestions} currentIndex={currentIndex} questionsSubmitted={res.length} />
                    </div>
                </>
            }

            {battleCompleted && 
                <DisplayHumiliation outcomes={outcomes} questions={questionsArr} />
            }
        </>
    )
}


//Display the user's progress
function DisplayProgress(props: {progress: number, numQuestions: number, currentIndex: number, questionsSubmitted: number}) {

    let remainingQuestions = props.numQuestions - (props.questionsSubmitted - 1)
    remainingQuestions = remainingQuestions > 0 ? remainingQuestions : 0;
    return (
        <>
            <p>Progress: {props.progress} / {props.numQuestions} Correct! </p>
            <p>Remaining: {remainingQuestions} questions </p>
        </>
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

function buildOutcomes(numQuestions: number): Outcome[] {
    const newArr = Array(numQuestions).fill(undefined);
    const objectified = newArr.map((elem) => {
        return {finalGuess: undefined, result: undefined,};
    });
    return objectified;
}



//ManualUpdateButton allows us to manually update to the next question rather than needing Correct answer or timeUp
//TESTING PURPOSES:
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