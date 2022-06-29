

import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import QuizDumb from './QuizQuestion';
import {genRandNum} from './genRandNum';


/* 
##########################################################################################
Issue11: Changes Requested
@@@@@
I think part of the complexity here is that your timer is buried too deep inside the application. 
I would move all time related code right up to the top-most component, eg. . This means that:
    (1)BattleGround can run the "coordinator" function of knowing when time is up, etc.
    (2) Quiz is dumb, it just gets given a question/answer, it has no idea about time
    (3) CountDown can then be extracted from Quiz"
@@@@@
my main criticism is that the "control logic" of the program is buried too deeply in the application. 
It should be extracted to the "top" so that the display components (eg. Quiz, CountDown) can focus purely on their own task. 

A good pattern to remember:
    - Try to limit the "logic" and "state" parts of your application as much as possible
    - One smart component and many "dumb" components is usually preferable

##########################################################################################
*/

/*
TODO:
    - Start with a hardcoded limit of 10 seconds
    - Display the number of seconds left
    - Have the number of seconds left get updated
    - When the timer hits zero, tell the user they ran out of time
    - Allow the user to set a custom time duration
*/



  //Hardcode upper and lower bounds
  let lowerBound = 0;
  let upperBound = 10;
  //Generate 2 random numbers within lowerBound-upperBound
  const num1 = genRandNum(lowerBound,upperBound);
  const num2 = genRandNum(lowerBound,upperBound);


/*Battlefied will coordinate quiz questions
Tasks
(0) INITIALISE QUIZ: 
    - Generate [(rand1,rand2), ....] with length n for each question
    - Setup data structures
THEN
(1) COORDINATE THE QUIZ:
    For each question
    - Run Timer & display <Quiz>
    - once timeUp || correct answer 
        then,
    - Start another timer for delayTime seconds
    - display results
    - Record result
    -> setNextQuestion().... use this to update state that will in turn trigger
    a rerender.... use this to rerender BattleField where some aspect of state 
    will update & in turn 
    ** REPEAT n times
*/

/* 
Basic functionality of Clock
    Purpose: to display a time and count down until timeRem = 0
    props: timeLimit, 
*/
export function BattleField(props: {timeLimit: number, numQuestions: number}) { 
    /*Phase0: Setup state & getQuestions  */
    const [timerDone, setTimerDone] = useState(false);
    //const [gotCorrect, setGotCorrect] = useState<boolean|undefined>();
    
    const quizActive = !timerDone // || gotCorrect
    //setGotCorrect: (x: boolean|undefined) => void
    //setGotCorrect={setGotCorrect}
    return (
        <>
            {/* */}
            {/*Phase1: start QuizClock & render question*/}
            
            {quizActive &&
                <div>
                <TimerQuiz timeLimit={props.timeLimit} setTimerDone={setTimerDone} />
                <QuizDumb num1={num1} num2={num2}/>
                </div>
            }
            
            {!quizActive &&
            <>
            <TimerQuiz timeLimit={props.timeLimit} setTimerDone={setTimerDone} />
            <ShowQuizResult />
            </>
            }
            
            

            {/*Phase2: questDone => start PostClock & render result */}
            
            
        </>
    )
    //<Quiz timeLimit={props.timeLimit} />
}



function ShowQuizResult(props: any) {
    return (
        <></>
    )
}


//Trying to make Timer dumb, it just counts down based on timeLimit, 
//Parent BattleGround will do the thinking about coordinating TimerQuiz multiple times... But just get it working for issue 11

//What do I need to add to QuizDumb to make it work with issue 11?
/*
    - display countDown time
    - make done = ( timeUp || answered )

    IMPLEMENTATION:
    decrement timeRem() for each second & display Quiz somewhere
    
    //Design CHOICE: put <QuizDumb> inside of <TimerQuiz>... or pass up the info (timeUp) to <BattleField> & 
    //let it coordinate between them... Probably second option better as more modular, but first is more naive
*/

function TimerQuiz(props: {timeLimit: number, setTimerDone: (b: boolean) => void}) {
    const [timeRem, setTimeRem] = useState(props.timeLimit);
    console.log("initial timeRem:",timeRem);
    //const [timeUp, setTimeUp] = useState('false');
    //questDone => true, when timeUp (for now), later need to think about question answered
    //const [questDone, setQuestDone] = useState(false);

    //Due to exhaustive-deps error... missing dependencies, had to destructure props outside of useEffect()
    //const {timeLimit, setTimerDone} = props;


    useEffect(() => {
        setTimeout(() => {
            if (timeRem > 0) {
                setTimeRem((timeRem) => timeRem - 1);
            } else {
                console.log('useEffect: ==>> timeRem now = 0....');
                props.setTimerDone((true));
            }
        },1000)
    },[timeRem,props])
    return (
        <>
            {timeRem > 0 && 
            <>Time Remaining: {timeRem} seconds</>
            }
            {!(timeRem > 0) && 
            <>Time ran out</>
            }
        </>
    )
}





/* 
            timeLimit: {props.timeLimit}
            <br />
            timeRem: {JSON.stringify(timeRem,null,4)}
            <br /><br />

*/