

import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Quiz } from './Quiz';
import QuizDumb from './QuizDumb';
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


export function BattleField(props: {timeLimit: number, numQuestions: number}) { 
    return (
        <>
            <QuizDumb num1={num1} num2={num2}/>
            <Quiz timeLimit={props.timeLimit} />
        </>
    )

}

function Timer() {
    return (
        <>
        </>
    )
}


