import React from 'react';
import {useState, useEffect, useRef} from 'react';

//interface BasicCounterPropsOld {timeRem: number, setTimeRem: (n: number) => void; timeLimit: number; timerDone: boolean; setTimerDone: (b: boolean) => void; handleTimerDone: any}
interface BasicCounterProps {timeRem: number, setTimeRem: (n: number) => void; handleTimerDone: any}
export function BasicCounter(props: BasicCounterProps) {
    //destucture props
    const {timeRem, setTimeRem, handleTimerDone} = props;
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (timeRem > 0) {
                setTimeRem(timeRem - 1);
            } else {
                handleTimerDone();
                

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




//Original Timer: Doesn't uses setTimerDone() instead of handleTimerDone() & includes a renderCount
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
