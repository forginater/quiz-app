import React from 'react';
import {useState, useEffect, useRef} from 'react';

//interface BasicCounterPropsOld {timeRem: number, setTimeRem: (n: number) => void; timeLimit: number; timerDone: boolean; setTimerDone: (b: boolean) => void; handleTimerDone: any}
interface BasicCounterProps {clockRunning: boolean, timeRem: number, setTimeRem: (n: number) => void; handleTimerDone: any}
function RunClock(props: BasicCounterProps) {
    //destucture props
    //const {timeRem, setTimeRem, handleTimerDone} = props;
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (props.timeRem > 0) {
                props.setTimeRem(props.timeRem - 1);
            } else {
                props.handleTimerDone();
            }

        },1000);
        return () => clearTimeout(timerId);
    },[props])
    if (props.timeRem > 0) {
        return <DisplayTimeRemaining timeRem={props.timeRem} />
    } else {
        return <TimesUp />
    }
}

export function BasicCounter(props: BasicCounterProps) { 
    if (!props.clockRunning) {
        return <>Quiz Over!!</>;
    } else {
        return <RunClock {...props}/>
    }
}




function DisplayTimeRemaining(props: {timeRem: number}) {
    return <>TimeRemaining: {props.timeRem}</>
}

function TimesUp() {
    return <>Time ran out!!</>;
}



/*

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
                //props.setTimerDone((true));
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
*/