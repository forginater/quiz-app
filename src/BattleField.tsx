

import React from 'react';
import './App.css';
import {useState, useEffect, useRef} from 'react';
import { Quiz } from './Quiz';
import {genRandNum} from './genRandNum';
import {QuizQuestion, ViewState} from './QuizQuestion';
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
type outcomeSimple = 'Hooray' | 'HoorayDenied'; 
//Hooray recorded when !timerDone && (answer===guess && answerChecked)
//

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


    
    //questData contains num1, num2, final guess & outcome for each Question
    const [questData, setQuestData] = useState<Question[]>(getQuestData(numQuestions,lowerBound,upperBound));
    //currentIndex being asked in questData
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    //Raised from <Battle>
    //State specific to currentQuestion
    const [guess,setGuess] = useState<number|undefined>();
    const [answerChecked, setAnswerChecked] = useState(false);


    /*MULTI START*/
    const num1 = questData[currentIndex].num1;
    const num2 = questData[currentIndex].num2;
    
    //destructure current questData
    //const {num1, num2, guess, outcome} = questData[currentIndex];

    //When Battle is done: (timerDone || (guess===answer && answerChecked)) then call handleNextQuestion() in <Battle>
    //      (1) update questData (guess & outcome)
    //      (2) currentIndex++;
    //  - When currentIndex is incremented =>
    //      (1) resets <Timer> & (2) triggers a rerender of <QuizQuestion>
    function handleUpdate(outcome: outcome, finalGuess: number) {
        //Clone the current question
        const cloneData = questData.slice();
        const cloneQuestion = questData.slice()[currentIndex];
        //update the final guess & the outcome from Battle
        const updatedQuestion = {
            ...cloneQuestion,
            guess: 10,
            outcome: 'Correct',
        }
        //const updatedQuestData = []
        console.log("ClonedQuest: ", cloneQuestion);
        console.log("updatedQuest: ", updatedQuestion);
        //setQuestData(questData)
        console.log("before update index: ",currentIndex);
        setCurrentIndex(index => index+1);
        console.log("post index update: ",currentIndex);
        //setQuestData(questData => )
    }

    console.log()

    function handleUpdateManual() {

        if (currentIndex < questData.length) {
            console.log("manually handle update: ",currentIndex);
            setCurrentIndex(currentIndex => currentIndex+1);
        }
        
        
    }
    
    return (
        <>
            <ViewState  index={currentIndex}/>
            <ViewState {...props} />
            <ViewState {...questData} />
            <Battle 
                timeLimit={timeLimit} 
                num1={num1} 
                num2={num2} 
                guess={guess}
                setGuess={setGuess}
                answerChecked={answerChecked}
                setAnswerChecked={setAnswerChecked}
                handleUpdateAuto={() => {}} 
                handleUpdate={handleUpdateManual}
            /> 
        </>
    )
}

interface BattleProps {
    timeLimit: number;
    num1: number;
    num2: number;
    guess: number|undefined;
    setGuess: (n: number|undefined) => void;
    answerChecked: boolean;
    setAnswerChecked: (b: boolean) => void;
    handleUpdate: any;
    handleUpdateAuto: any;
}


//Quarantine data from this specific question
//Coordinator needs the question/answer (num1 & num2) & timeLimit... 
//if timeUp || correctGuess => alert parent, which will increment currentIndex
function Battle(props: BattleProps) {
    //destructure
    const {guess,setGuess,answerChecked,setAnswerChecked} = props;
    const answer = props.num1 * props.num2; 
    

    //timerDone is toggled to true when $timeLimit seconds have passed
    const [timerDone, setTimerDone] = useState(false);
    
    //Does this increase changes of desync issues?
    const battleTerminated = (timerDone || (guess===answer && answerChecked));



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
        //{battleTerminated && props.handleUpdate()}
        <div>
            <label>
                nextQuestion:
                <input 
                    type="button"
                    value="Update Index"
                    onClick={(e) => {props.handleUpdate()}}
                />
            </label>
            <br/>
            
            <Timer 
                timeLimit={props.timeLimit} 
                timerDone={timerDone}
                setTimerDone={setTimerDone} 
            />
            <QuizQuestion 
                num1={props.num1} 
                num2={props.num2}
                guess={guess}
                answerChecked={answerChecked}
                setAnswerChecked={setAnswerChecked}
                handleGuess={handleGuess}
            />
        </div>
    )


}

interface TimerProps {timeLimit: number; timerDone: boolean; setTimerDone: (b: boolean) => void;}
function Timer(props: TimerProps) {
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

    if (timeRem > 0) {
        return <DisplayTimeRemaining timeRem={timeRem} />
    } else {
        return <TimesUp />
    }
}

function DisplayTimeRemaining(props: {timeRem: number}) {
    return <>TimeRemaining: {props.timeRem}</>
}

function TimesUp() {
    return <>Time ran out!!</>;
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





let questionsInit: (x: number, y: number) => Question[];
//Initialise questData with a variable
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


    /*SINGULAR START
    //THIS is probably a bad way to do it... 
    //But allows testing the component while I don't have multiple questions functionality
    const num1Ref = useRef(genRandNum(lowerBound,upperBound));
    const num2Ref = useRef(genRandNum(lowerBound,upperBound));
    const num1_ = num1Ref.current;
    const num2_ = num2Ref.current;
    //Answer for this question
    const answer_ = num1_ * num2_; 
    SINGULAR END*/





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