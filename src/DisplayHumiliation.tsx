import { Outcome, Question } from "./BattleField";



type ZippedTuple = [question: Question, outcome : Outcome];
interface PatheticHumanWeepProps {zip: ZippedTuple;}

//DisplayHumiliation() displays results when the quiz has finished running
//Takes outcomes & questions arrays and zips them into an array of [question,outcome] tuples.
//maps each tuple into a list element displaying the original question, answer & the outcome
export function DisplayHumiliation(props: {outcomes: Outcome[], questions: Question[]}) {
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