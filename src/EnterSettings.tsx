import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';

//Quiz settings must be custom entered or the default settings accepted before quiz is started
export function EnterSettings(props: {timeLimit: number, setTimeLimit: (n: number) => void, setDoneSettings: (b: boolean) => void}) {
    return (
      <div>
        <h3>Enter Quiz Settings:</h3>
        <label>
          Enter time limit in seconds:
          <h1>TimeLimit JSON.stringify(props.value) = {JSON.stringify(props.timeLimit,null,4)}</h1>
          <h1>TimeLimit NaN = {JSON.stringify(isNaN(props.timeLimit as number))}</h1>
          <input 
            type="number"
            value={props.timeLimit ?? ''}
            onChange={(e) => {
              props.setTimeLimit(parseInt(e.target.value)); 
              
            }}
          />
        </label>
        <br/><br/>
        <label>
          <input
            type="button"
            value="Start Quiz"
            onClick={(e) => {
              isNaN(props.timeLimit)
                ? console.log("Please enter an integer timeLimit > 0!") 
                : props.setDoneSettings(true);

            }}
          />
            
        </label>
  
      </div>
    )
  }

  //Quiz settings must be custom entered or the default settings accepted before quiz is started
export function EnterSettingz(props: {timeLimit: number, setTimeLimit: (n: number) => void, setDoneSettings: (b: boolean) => void}) {
  return (
    <div>
      <h3>Enter Quiz Settings:</h3>
      <label>
        Enter time limit in seconds:
        <input 
          type="text"
          value={props.timeLimit}
          onChange={(e) => {
            Number.isNaN(parseInt(e.target.value)) 
            ? console.log("Invalid non-number character entered into timeLimit field!") 
            : props.setTimeLimit(parseInt(e.target.value));            
            //There is a bug here: can't backspace to empty field when only 1 character left
          }}
        />
      </label>
      <br/><br/>
      <label>
        <input
          type="button"
          value="Start Quiz"
          onClick={(e) => {
            props.setDoneSettings(true);
          }}
        />
          
      </label>

    </div>
  )
}