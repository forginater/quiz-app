

import React from 'react';
import './App.css';
import {useState, useEffect, useRef, useMemo} from 'react';
import { Quiz } from './Quiz';
import {genRandNum} from './genRandNum';
import {QuizQuestion, QuizQuestionProps, ViewState, ViewStateNewLine} from './QuizQuestion';
import { count } from 'console';
import { BasicCounter } from './TimerComponents';
import { DisplayHumiliation } from './DisplayHumiliation';


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
##########################################################################################
*/


export interface BattleFieldProps {
    timeLimit: number;
    numQuestions: number;
    lowerBound: number;
    upperBound: number;
    
}



//each individual QuizQuestion formed by a Question object num1 * num2
export interface Question {
    num1: number;
    num2: number;
}

//outcome of each QuizQuestion is stored in an Outcome object
export interface Outcome {
    finalGuess: number | undefined;
    result: string | undefined;  //"Correct" | "Incorrect" | "TimeUp" | undefined
}



/*BattleField() coordinates running multiple questions with time delays and records the results*/
//FUNCTIONALITY: 
//A quiz question is finished when user has inputted a correct answer & clicked the CheckAnswer button
//BattleField keeps displaying the current question until either (1) user gets the right answer or (2) Timer reaches timeLimit
//BattleField uses currentIndex to loop through each question (stored in questionsArr) & record the result (stored in outcomes)
//  For each increment of index: 
//  - display the question, run the timer, store the result, 
//  - update progress & questionsDone and render QuizQuestion with new data & empty guess state
export function BattleField(this: any, props: BattleFieldProps) { 

    //Destructure BattleFieldProps to improve readability
    const {timeLimit,numQuestions,lowerBound,upperBound} = props;

    //STATE Specifc to BattleField (a series of questions)
    //currentIndex of question being displayed from outcomes hook & index to store result in outcomes hook
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    //results: "Correct" | "Incorrect" | "TimeUp" & the finalGuess submitted
    const [outcomes, setOutcomes] = useState<Outcome[]>(() => buildOutcomes(numQuestions));
    //questionsArr contains nested arrays with num1, num2 where questionAnswer = num1 * num2
    const [questionsArr] = useState<Question[]>(() => buildQuestions(numQuestions,lowerBound,upperBound));
    //battleCompleted set to true once all questions have been answered or timedOut.. Counter stops & results displayed
    const [battleCompleted, setBattleCompleted] = useState<boolean>(false);
    //progress: number of correct guesses submitted before timer countdown
    const [progress, setProgress] = useState(0);
    //number of questions that have been completed (answered correctly or timed out)
    const [questionsDone, setQuestionsDone] = useState(0);


    //STATE specific to each question (raised from QuizQuestion)
    //guess contains the last value inputted into and displayed by the Guess function.
    const [guess,setGuess] = useState<number|undefined>();
    //answerChecked is set to true when user clicks checkAnswer button, reset to false when current question is done
    const [answerChecked, setAnswerChecked] = useState(false);
    //timeRem: time remaining in CountDown to answer a specifi QuizQuestion 
    const [timeRem, setTimeRem] = useState(props.timeLimit);




    ////////////////////////////////////////////////////////////
    //GETTER FUNCTIONS

    //get the answer to the question at the given index
    function getAnswer(index: number) {
        return questionsArr[index].num1 * questionsArr[index].num2;
    }

    //check whether the question at index is the last question
    function isLastQuestion(index: number) {
        //index of last question occurs @ numQuesstions -1 => 
        return (index === (numQuestions - 1)) ? true : false;
    }


    ////////////////////////////////////////////////////////////
    //HANDLER FUNCTIONS
    //These functions passed to child components as props to handle events
    //The 3 events that need to be handled are:
    //  (1) timer exceeds timeLimit
    //  (2) guess inputted
    //  (3) check answer button clicked

    //Note: successfull outcome => correct guess && answerButton clicked || timerUp
    //Therefore, 

    //handleTimerDone()
    //PURPOSE: setTimerDone(true), call updateBattleField then reset Timer
    //If timeUp then 'Incorrect'
    function handleTimerDone() {
        console.log("handleTimerDone() called:");

        setTimeRem(timeLimit);
        //always update if timer, except
        //has finished with 'Incorrect'
        //Need to check here: if this is final question x: don't need to update
        setQuestionsDone(prev => prev + 1);
        updateOutcomes(currentIndex, {finalGuess: undefined, result: "TimeUp"})
        updateBattleField("Time");
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
            updateBattleField("Guess");
        }  
    };

    //handleCheckAnswerButton() is called when CheckAnswer button clicked:
    function handleCheckAnswerButton() {
        setAnswerChecked(true);
        //Update if: correct answer was entered before clicking CheckAnswerButton
        const updateNow = (guess === getAnswer(currentIndex));
        if (updateNow) {
            console.log(">>>>checkAnswerButton() calling updateBattleField()");
            handleResult(currentIndex,true,guess);
            updateBattleField("Check");
        }
    }

    ////////////////////////////////////////////////////////////
    //UPDATER FUNCTIONS: 
    //The updater functions are called by the above handlers in order to: 
    // determine the outcome of the an event registers by one of the handlers: Incorrect, Correct, TimeUp
    //  - update BattleField state: increment (current index questionsDone, progress) 
    //  - record outcome in outcomes
    //  - update the props to QuizQuestion:
    //      - with the next question getQuizQuestionProps()
    //      - reset the answerChecked & guessFields refreshUserInputFields()

    //Note: this is only called when timer is prematurely reset by updateBattleField() due to correct answer
    function resetTimer() {
        setTimeRem(timeLimit);
    }


    //updateBattleField() called every time a questions is finished
    //RESPONSIBILITY: check if last question: incrementIndex, resetTimer(), refresh QuizQuestion props, determine when battleCompleted
    type caller = "Time" | "Check" | "Guess" | "Manual" //useful for debugging, can delete
    function updateBattleField(caller: caller) {
        const nextIndex = currentIndex + 1;
        //Not last question:
        if (!isLastQuestion(currentIndex)) { 
            resetTimer()
            refreshUserInputFields();
            setCurrentIndex(nextIndex);
        }
        else { //This is the last question, updateResults & set battleDone 
            setBattleCompleted(true);

        }   
    }


    //handleResult() called by handleGuess() & handleCheckAnswerButton() 
    //RESPONSIBILITY: determine outcome and update and store the result
    //explicitly pass index, answerChecked & newGuess as arguments to avoid stale data
    function handleResult(index: number, checked: boolean, newGuess: number|undefined) {
        const ans = questionsArr[index].num1 * questionsArr[index].num2;
        const newResult = (checked && newGuess===ans) //If
            ? 'Correct'
            : 'Incorrect';
        //update progress value if correct answer
        if (newResult === 'Correct') {
            setProgress(prev => prev + 1);
        }
        //update questionsDone
        setQuestionsDone(prev => prev + 1);
        //push results to outcomes
        const newOutcome = {finalGuess: newGuess, result: newResult}
        updateOutcomes(index,newOutcome)
    }

    //update the Outcome object at index in the outcomes useState array.
    function updateOutcomes(index: number, newOutcome: Outcome) {
        const clonedOutcomes = outcomes.slice();
        clonedOutcomes[index] = {...newOutcome};
        setOutcomes([...clonedOutcomes]);
    }
    
    //refreshUserInputFields()
    //After incrementIndex and displaying next question, need to refresh userInputFields 
    function refreshUserInputFields() {
        setGuess(undefined);
        setAnswerChecked(false);
    }



    //Get the current BattleProps based on the current index. Used by updateBattleField() which is invoked by handlers() when questionDone
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
                        <DisplayProgress progress={progress} numQuestions={numQuestions} currentIndex={currentIndex} questionsDone={questionsDone} />
                    </div>
                </>
            }

            {battleCompleted && 
                <DisplayHumiliation outcomes={outcomes} questions={questionsArr} />
            }
        </>
    )
}


//Display the user's progress during the quiz: display 
//  - Progress: #correct / #questions
//  - Remaining: total questions remaining before end of quiz
function DisplayProgress(props: {progress: number, numQuestions: number, currentIndex: number, questionsDone: number}) {

    const remainingQuestions = props.numQuestions - props.questionsDone;
    return (
        <>
            <p>Progress: {props.progress} / {props.numQuestions} Correct! </p>
            <p>Remaining: {remainingQuestions} questions </p>
        </>
    )
}





//buildQuestions() builds the initial input for the questionsArr useState array with numQuestions * Question objects
function buildQuestions(numQuestions: number, lowerBound: number, upperBound: number): Question[] {
    return Array(numQuestions).fill(undefined).map((question) => {
        return {
            num1: genRandNum(lowerBound,upperBound),
            num2: genRandNum(lowerBound,upperBound),
    };
})
}

//Build the initial input for the 'outcomes' useState array, leave the values undefined until outcome is recorded
function buildOutcomes(numQuestions: number): Outcome[] {
    const newArr = Array(numQuestions).fill(undefined);
    const objectified = newArr.map((elem) => {
        return {finalGuess: undefined, result: undefined,};
    });
    return objectified;
}



