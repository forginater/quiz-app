import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';

import { Quiz } from './Quiz';




export function BattleField(props: {timeLimit: number, numQuestions: number}) {
    //questRem is the number of questions that still need to be rendered
    const [questRem, setQuestRem] = useState(props.numQuestions);
    //correctAnswers: number of guesses that have been correct
    const [results, setResults] = useState<Array<any>>(Array(questRem).fill(undefined));

    /*
    Use a loop or map array object or something to iterate QuestRem times.
    Need a mechanism: 
    - While (questRem > 0) Render <Quiz> 
    - For each <Quiz> instance, once (done == true), update the outcomes array in <BattleField>
    */

    function handleUpdateOutcomes(newResult: any) {
        //Duplicate results state
        const resultsLocal = results.slice();
        //add the new guess at the index corresponding to the current question
        resultsLocal[questRem] = newResult;
        //Update results in state
        setResults({...resultsLocal});
        //Decrement number of questions remaining which should refresh the <Quiz> with next question
        if (questRem > 0) {
            setQuestRem(questRem - 1);
        }
        

    }

    //while (questRem > 0)

    //{outcomes.map((outcomes) => {return <Quiz timeLimit={props.timeLimit}/>})}

    return (
        <>
            <Quiz timeLimit={props.timeLimit} />
        </>
    )
}










//Array.apply(null, Array(7)).map(function(item, i) {}
//Array(someLength).fill(someDefault).map(someFunction)
//Array(1000).fill(1).map((n,i) => n+i)

//const arr = Array(5).fill(1).map((num,index) => num * index);

/*
<ul>
    {arr.map((x) => {
    return <li>The value is {x}</li>  
})}
</ul>
*/