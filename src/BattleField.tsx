

import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import {genRandNum} from './genRandNum';
import {QuizQuestion} from './QuizQuestion';


/* 
##########################################################################################
TODO:
    - Start with a hardcoded 10 questions
    - Display the user's progress (eg. x / 10 questions)
    - Once the user answers a question successfully, or the timer has elapsed, ask the next one
    - If they got all the questions right, display the results
    - Allow user to modify the number of questions asked
##########################################################################################
*/

/*
Things to note
    questionDone = guessedCorrectly || timeUp
    only display results if progress == 10/10
*/

//outcome of attempting a question: undefined <=> hasn't been answered yet, 'Correct' => guessed right answer before timeUp
type outcome = undefined | 'Correct' | 'Incorrect' | 'TimeUp';

//for each individual quiz question, 'Question' interface used to store the numbers used to form the question , the latest guess & the outcome 
interface Question {
    num1: number;
    num2: number;
    guess: number|undefined;
    outcome: outcome; //this will be undefined until outcome is recorded <=> questionDone
}


    //Hardcode upper and lower bounds
    let lowerBound = 0;
    let upperBound = 10;
    //Generate 2 random numbers within lowerBound-upperBound
    const num1 = genRandNum(lowerBound,upperBound);
    const num2 = genRandNum(lowerBound,upperBound);



//getQuestData() builds the initial input for the questData useState hook with numQuestions * Question objects
function getQuestData(numQuestions: number): Question[] {
    return Array(numQuestions).fill(undefined).map((question) => {
        return {num1: genRandNum(lowerBound,upperBound),num2: genRandNum(lowerBound,upperBound),guess: undefined,outcome: undefined,
    };
})
}



export function BattleField(props: {timeLimit: number, numQuestions: number}) { 
    //questData contains num1, num2, final guess & outcome for each Question
    const [questData, setQuestData] = useState<Question[]>(getQuestData(props.numQuestions));
    //currentIndex: the index of the current question from questData
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    //timerDone => the timeLimit for this question has elapsed, 
    //guessedCorrect reflects whether the user has inputted the correct answer for the current question in QuizQuestion
    const [guessedCorrect, setGuessedCorrect] = useState(false);
    //timerDone is toggled to true when $timeLimit seconds have passed
    const [timerDone, setTimerDone] = useState(false);


    
    return (
        <div>
            <h1>guessedCorrect:: {JSON.stringify(guessedCorrect,null,4)}</h1>
            
            <Timer 
                timeLimit={props.timeLimit} 
                setTimerDone={setTimerDone} 
            />
            <QuizQuestion 
                num1={num1} 
                num2={num2}
                setGuessedCorrect={setGuessedCorrect}
            />
        </div>
    )
}

function Timer(props: {timeLimit: number, setTimerDone: (b: boolean) => void}) {
    const [timeRem, setTimeRem] = useState(props.timeLimit);
    useEffect(() => {
        
        setTimeout(() => {
            if (timeRem > 0) {
                setTimeRem((timeRem) => timeRem - 1);
            } else {
                props.setTimerDone((true));
            }
        },1000)
    },[timeRem])
    return (
        <>
                {timeRem > 0 && <>Time Remaining: {timeRem} seconds</>}
                {!(timeRem > 0) && <>Time ran out</>}
            
        </>
    )
}



//Initialise questionsData with a variable
const questionsInit: Question[] = Array(10).fill(undefined).map((question) => {
    return {num1: genRandNum(lowerBound,upperBound),num2: genRandNum(lowerBound,upperBound),guess: undefined,outcome: undefined,
    };
});

//Testing out questionsInit data structure
const testQuestionsInit = () => (() => {
    const nerd = questionsInit.map((quest,i) => {
        console.log(`mapping ${i}:  \n   =>`,JSON.stringify(quest,null,4));
        console.log('   => length: ',Object.keys(quest).length);
        let retArr = Object.values(quest).map((val) => {return val});
        console.log('   => values: ',retArr);
    });
})();