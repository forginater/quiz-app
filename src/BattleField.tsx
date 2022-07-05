

import React from 'react';
import './App.css';
import {useState, useEffect, useRef} from 'react';
import { Quiz } from './Quiz';
import {genRandNum} from './genRandNum';
import {QuizQuestion} from './QuizQuestion';
import { count } from 'console';


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

//outcome of attempting a question: undefined <=> hasn't been answered yet, 'Correct' => guessed right answer before timeUp
type outcome = undefined | 'Correct' | 'Incorrect' | 'TimeUp';

//for each individual quiz question, 'Question' interface used to store the numbers used to form the question , the latest guess & the outcome 
interface Question {
    num1: number;
    num2: number;
    guess: number|undefined;
    outcome: outcome; //this will be undefined until outcome is recorded <=> questionDone
}






/*BattleField() coordinates running multiple questions with time delays and records the results
    - When (guessedCorrect || timerDone)  
        (1) update questData (guess & outcome)
        (2) currentIndex++;
    - When currentIndex is incremented =>
        (1) resets <Timer> & (2) triggers a rerender of <QuizQuestion>

*/
export function BattleField(props: BattleFieldProps) { 

    //Destructure props
    const {timeLimit,numQuestions,lowerBound,upperBound} = props;

    //Initialise State
    //timerDone is toggled to true when $timeLimit seconds have passed
    const [timerDone, setTimerDone] = useState(false);
    const [guess,setGuess] = useState<number|undefined>();
    const [answerChecked, setAnswerChecked] = useState(false);
    
    //THIS is probably a bad way to do it
    //Will raise this to <App> component so it can be passed through in props
    const num1Ref = useRef(genRandNum(lowerBound,upperBound));
    const num2Ref = useRef(genRandNum(lowerBound,upperBound));
    const num1 = num1Ref.current;
    const num2 = num2Ref.current;
    
    //Answer for this question
    const answer = num1 * num2; 

    function handleSetup() {
        
    }
    
    //setup handleGuess() function
    //handleGuess will freeze guess user input when 
    //  (1) timer has completed or 
    //  (2) user has inputted correct guess & clicked the check answer button
    function handleGuess(newGuess: number|undefined): void {
        if ((answerChecked && answer===guess) || timerDone) { 
            console.log("freeze guess field!!");
        } else {
            console.log("handleGuess() called:")
            setGuess(newGuess);
        }
    };
    

    return (
        <div>
            <Timer 
                timeLimit={props.timeLimit} 
                setTimerDone={setTimerDone} 
            />
            <QuizQuestion 
                num1={num1} 
                num2={num2}
                guess={guess}
                answerChecked={answerChecked}
                setAnswerChecked={setAnswerChecked}
                handleGuess={handleGuess}
            />
        </div>
    )
}



function Timer(props: {timeLimit: number, setTimerDone: (b: boolean) => void}) {
    const [timeRem, setTimeRem] = useState(props.timeLimit);
    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current = renderCount.current + 1;
    });
    useEffect(() => {
        
        const timerId = setTimeout(() => {
            if (timeRem > 0) {
                setTimeRem((timeRem) => timeRem - 1);
            } else {
                props.setTimerDone((true));
            }
        },1000);
        return () => clearTimeout(timerId);
    },[timeRem])
    return (
        <>
                <h1>ClockRender: {renderCount.current}</h1>
                {timeRem > 0 && <>Time Remaining: {timeRem} seconds</>}
                {!(timeRem > 0) && <>Time ran out</>}
            
        </>
    )
}


//AUXILLIARY FUNCTIONS:

//getQuestData() builds the initial input for the questData useState hook with numQuestions * Question objects
function getQuestData(numQuestions: number, lowerBound: number, upperBound: number): Question[] {
    return Array(numQuestions).fill(undefined).map((question) => {
        return {
            num1: genRandNum(lowerBound,upperBound),
            num2: genRandNum(lowerBound,upperBound),
            guess: undefined,
            outcome: undefined,
    };
})
}



/*
function questionsInit(lowerBound: number, upperBound: number): Question[] {Array(10).fill(undefined).map((question) => {
    return {num1: genRandNum(lowerBound,upperBound),num2: genRandNum(lowerBound,upperBound),guess: undefined,outcome: undefined,
    };
})};
*/


let questionsInit: (x: number, y: number) => Question[];
//Initialise questionsData with a variable
questionsInit = function(lowerBound: number, upperBound: number) {
    const arr = Array(10).fill(undefined).map((question) => {
        return {num1: genRandNum(lowerBound,upperBound),num2: genRandNum(lowerBound,upperBound),guess: undefined,outcome: undefined,
    };
})
return arr;
}

//Testing out questionsInit data structure
const testQuestionsInit = (x: number, y: number) => (() => {

    const nerd = questionsInit(x,y).map((quest,i) => {
        console.log(`mapping ${i}:  \n   =>`,JSON.stringify(quest,null,4));
        console.log('   => length: ',Object.keys(quest).length);
        let retArr = Object.values(quest).map((val) => {return val});
        console.log('   => values: ',retArr);
    });
})();



/*Managed to trigger this error: Warning: 
    Cannot update a component (`BattleField`) while rendering a different component (`HandleIndex`). 
    To locate the bad setState() call inside `HandleIndex`
//<HandleIndex setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} timerDone={timerDone} guessedCorrect={guessedCorrect}/>
function HandleIndex(props: any) {
    if (props.guessedCorrect || props.timerDone) {
        props.setCurrentIndex(props.currentIndex + 1);
    }
    return (
        <></>
    )
}
*/








/* 
Removed from issue12-post-1.1

    //questData contains num1, num2, final guess & outcome for each Question
    const [questData, setQuestData] = useState<Question[]>(getQuestData(props.numQuestions));
    //currentIndex: the index of the current question from questData
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    //timerDone => the timeLimit for this question has elapsed, 
    //guessedCorrect reflects whether the user has inputted the correct answer for the current question in QuizQuestion
    const [guessedCorrect, setGuessedCorrect] = useState(false);


    //const [renderCount, setRenderCount] = useState(0);
    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current = renderCount.current + 1;
    });

    //destructure num1 & num2 from currentQuestion
    const num1 = questData[currentIndex].num1;
    const num2 = questData[currentIndex].num2;
    //const thisQuestion = questData[currentIndex];  
    //const done = (guessedCorrect || timerDone);

*/