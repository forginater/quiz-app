

import React from 'react';
import './App.css';
import {useState, useEffect, useRef} from 'react';
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


/*export*/ interface BattleFieldProps {
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
   (0) Modify handlers()
       - for scalability, we want the handlers to do what you would expect, then call the updateIfQuestionDone() function
       - 2 reasons: 
       - (1) separate business logic from intuitive purpose of handlers
       - (2) if requirements of questionDone change, it will be easier to update

   (a) handleTimerDone() 
        - For now, we know this definitely => call updateApp() but this may change 
   (b) handleGuess() 
        - call updateIfQuestionDone().... be careful of stale data

   (1) define function updateIfQuestionDone() {
        if (questionDone())  //When (guessedCorrect || timerDone)  
        then do the following:
        (2) record results 
        (3) currentIndex++;
        (4) reset <Timer> 
        (5) "rerender" <QuizQuestion> by:
            (a) provide props to next question
            (b) initialise raised state variables

    }
    Let's split up the workload:
    (1) updateIfQuestionDone() 
        => updateApp() includes following:
    
    (2) updateResults
    (3) incrementIndex
    (4) reset <Timer>
    (5) reset <QuizQuestion>

    
*/

/*export*/
/*export*/ function BattleFieldOld(this: any, props: BattleFieldProps) { 

    //Destructure props
    const {timeLimit,numQuestions,lowerBound,upperBound} = props;

    //Temporarily pushing results to this array instead of questData
    const [results, setResults] = useState(Array(props.numQuestions).fill(undefined));
    const [resultsVerbose, setResultsVerbose] = useState(Array(props.numQuestions).fill(undefined));
    //questData contains num1, num2, final guess & outcome for each Question
    const [questData, setQuestData] = useState<Question[]>(getQuestData(numQuestions,lowerBound,upperBound));
    //currentIndex being asked in questData
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    //State specific to currentQuestion
    const [guess,setGuess] = useState<number|undefined>();
    const [answerChecked, setAnswerChecked] = useState(false);

    //timerDone is toggled to true when (timeRem===0) <=> $timeLimit seconds have passed
    const [timerDone, setTimerDone] = useState(false);
    const [timeRem, setTimeRem] = useState(props.timeLimit);

  
    const allState = {
        results: results,
        currentIndex: currentIndex,
        guess: guess,
        answerChecked: answerChecked,
        timerDone: timerDone,
        timeRem: timeRem,
    }

    function viewAllState() {
        const obj = allState;
        const entries = Object.entries(obj);
        console.log("viewAllState:");
        for (const [key,value] of entries) {
            console.log("key: ", key, "         value: ",value);
            
        }
    }

    

    //BUSINESS LOGIC:
    //ASSUMPTIONS: GET FUNCTIONS need to be called before QuizQuestions are rendered with next question
    //They base their answer on values that are wiped each new question 
    //so if they are called after updating UI to next question, they will return stale data
    
    ////////////////////////////////////////////////////////
    //GET FUNCTIONS
    //getOutcome returns the outcome based on this index
    function getOutcome(index: number) {
        if (answerChecked && guess===getAnswer(index)) {
            return 'Correct';
        } else {
            return 'Incorrect';
        }
    }

    //get the answer the question corresponding to index in argument
    function getAnswer(index: number) {
        return questData[index].num1 * questData[index].num2;
    }

    //when questionDone() => call handleUpdateManual()
    //Return true if this question is done & needs time to update outcomes & index
    function isQuestionDone(answerCheckedArg: boolean, newGuess: number|undefined) {
        //console.log("isQuestionDone() called: ", "\n    => isQuestionDone: ", (answerChecked && getAnswer(currentIndex)===guess) || timerDone));
        return (((answerCheckedArg && getAnswer(currentIndex)===newGuess)) || timerDone);
    }

    function isLastQuestion(index: number) {
        //index of last question occurs @ numQuesstions -1 => 
        if (true) {console.log("isLastQuestion() thisIndex:",index, " currentIndex: ", currentIndex);}
        //
        return (index === (numQuestions - 2)) ? false : true;
    }

    ////////////////////////////////////////////////////////////
    //UPDATER FUNCTIONS




    function updateResults(index: number) {
        //Push to prexisting array
        //setResults([...results,'index #' + index + ' result is: ' + getOutcome(index)])
        const cloneResults = results.slice();
        //mutate and return result @index
        cloneResults[index] = getOutcome(index); 
        setResults([...cloneResults]);
    }

    function incrementIndex() {
        setCurrentIndex(currentIndex + 1);
    }

    //Note: this is only called when timer is prematurely reset by handleUpdate() due to correct answer
    //no need to setTimerDone(true) as the next question would setTimerDone(false) straight afterwards
    function resetTimer() {
        setTimeRem(timeLimit);
    }

    //This is the main function responsible for updating the BattleField state
    //Called by handleTimerDone() & if(isQuestionDone) also by handleGuess() 
    function handleUpdate() { //outcome: outcome, finalGuess: number
        //Need to make sure it isn't the last question
        console.log("handleUpdate() called");
        const indexNow = currentIndex;
        if (isLastQuestion(currentIndex)) { 
            //questions remain: updateResults, reset Timer & render nextQuestion
            console.log("REMAIN");
            //updateResults(indexNow);
            setResults([...results,'index #' + indexNow + ' result is: ' + getOutcome(indexNow)]);
            resetTimer();
            nextQuizQuestionPropsInit();
            incrementIndex();
        }
        else { //This is the last question, just updateResults
            console.log("LAST");
            updateResults(indexNow);
        }   
    }

    //Write it all out slowly, then refactor into other functions:
    //Confirm at beginning that no state values are stale
    function handleUpdateVerbose(latestGuess: number|undefined, latestClicked: boolean, latestTimerDone: boolean) {
        const indexNow = currentIndex;
        const ans = getAnswer(currentIndex);
        const res = latestGuess===ans;
        const n1 = questData[currentIndex].num1;
        const n2 = questData[currentIndex].num2;
        const questionDone = ((res && latestClicked) || timerDone);
        console.log("handleUpdateVerbose:"," index:",indexNow," ans:",ans," res:",res," n1:",n1," n2:",n2, " done:",questionDone, " guess:",latestGuess," click:",latestClicked," timer:",latestTimerDone);
        
        
        if (questionDone) { //time to update
            if (currentIndex < (questData.length -2)) { //not the last question
                //set results
                
                //const cloned = [...resultsVerbose]
                //const updated = cloned.splice(currentIndex,1,{ans: ans,res: res, guess:guess});
                //console.log("JSON",JSON.stringify(updated));
                //setResultsVerbose([...updated]);
                
                //setResultsVerbose([...results,'index #' + indexNow + ' result is: ' + getOutcome(indexNow) + ' guess was: ',latestGuess]);
                //setResults([...results,'index #' + indexNow + ' result is: ' + getOutcome(indexNow)]);
                console.log("questionDone Loop")
                
                //resetTimer
                //resetProps
                //incrementIndex


            } else { //last question
        
            }
        }
        


    }




    function handleUpdateManual() {
        if (true) {
            handleUpdate();
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            return;
        }
        if (currentIndex < questData.length) {
            const indexNow = currentIndex;
            console.log("manually handle update: ",indexNow);
            const newIndex = indexNow + 1;
            setCurrentIndex(newIndex);
            setResults([...results,'index #' + indexNow + ' result is: ' + getOutcome(indexNow)])
            //need to update outcomes/results
            //update props to <Battle> to render next question
            nextQuizQuestionPropsInit();
        }
    }

    function updateIfQuestionDone(answerCheckedArg: boolean, newGuess: number|undefined) {
        const num1 = questData[currentIndex].num1;
        const num2 = questData[currentIndex].num2;
        console.log("updateIfQuestionCalled()");
        console.log("==>>DEBUG: updateIf(), ","result= ", (newGuess===(questData[currentIndex].num1 * questData[currentIndex].num2)), "     answerChecked: ", answerChecked, "       timerDone: ", timerDone,    "guess: ",guess, "  currentIndex: ",currentIndex, "question: ",num1,"x",num2 );
        let condition = isQuestionDone(answerCheckedArg,newGuess);
        //condition = (((answerCheckedArg && getAnswer(currentIndex)===newGuess)) || timerDone);
        
        if ( (answerCheckedArg&&(newGuess===(questData[currentIndex].num1 * questData[currentIndex].num2))) || timerDone ) {
            console.log("updateIfQuestionCalled() true => callUpdate()");
            handleUpdate();
        }
    }

    //Get the current BattleProps based on the current index
    function getQuizQuestionProps(index: number) {
        return {
            //Get questions from current question
            num1: questData[index].num1,
            num2: questData[index].num2,
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
        setTimerDone(false)
    }

    ////////////////////////////////////////////////////////////
    //HANDLER FUNCTIONS
    //(for child stateless components)
    //NOTE: atm, successfull outcome = (answerChecked && getAnswer(currentIndex)===guess) || timerDone
    //Therefore, handleTimerDone() will call updateApp() by default, whereas handleGuess() will need to check questionDone()

    //handleTimerDone()
    //PURPOSE: setTimerDone(true), call handleUpdateManual then reset Timer
    function handleTimerDone() {
        console.log("handleTimerDone() called:");
        setTimerDone(true);
        //handleUpdate();
        //handleUpdateVerbose(guess,answerChecked,true);
        handleUpdate()
        setTimeRem(timeLimit);
    }
    

    //handleGuess() 
    //PURPOSE: Freeze <Guess> & setGuess(newGuess)
    function handleGuess(newGuess: number|undefined): void {
        
        console.log("handleGuess() called:")
        setGuess(newGuess);
        handleUpdate()
        //updateIfQuestionDone(answerChecked,newGuess); //update if answerChecked & guess===answer
        //handleUpdateVerbose(newGuess,answerChecked,timerDone);
    };

    function handleCheckAnswerButton() {
        
        setAnswerChecked(true);
        //Also need to check updateIfQuestionDone(), in case user entered correct guess before clicking button
        //updateIfQuestionDone(true,guess);
        handleUpdate()
        //handleUpdateVerbose(guess,true,timerDone);
    }


    




    ////////////////////////////////////////////////////////////
    //BattleField return JSX component
    //<ViewState  results={results}/>
    return (
        <>
            <>  
                <ViewState  resultsVerbose={results}/>
                
                <ViewState  index={currentIndex}/>
                <ViewState {...props} />
                <ViewState {...questData} />
                <label>
                    viewStateInConsole:
                    <input 
                    type="button"
                    value="ViewState:"
                    onClick={(e) => viewAllState()}
                    />                    
                </label>
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
                    <QuizQuestion {...getQuizQuestionProps(currentIndex)} />
                </div>
        </>
    )
}

/* 
                <ViewStateNewLine  allState={allState}/>

*/


//ManualUpdateButton allows it to manually update to the next question 
//TESTING:
function ManualUpdateButton(props: {onClick: any}) { 
    return (
        <label>
            nextQuestion:
            <input 
                type="button"
                value="Update Index"
                onClick={(e) => {props.onClick()}}
            />
        </label>
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




//GRAVEYARD FUNCTIONS:

        /*
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
    */


/* 
    function handleGuessOld(newGuess: number|undefined): void {
        console.log("handleGuess() called:")
        if ((answerChecked && getAnswer(currentIndex)===guess) || timerDone) { 
            console.log("freeze guess field!!");
        } else {
            setGuess(newGuess);

        }
    };
*/






/* 
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
*/



