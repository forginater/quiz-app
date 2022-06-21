import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';


//Quiz settings must be custom entered or the default settings accepted before quiz is started
export function EnterSettings(props: {timeLimit: number, numQuestions: number, setTimeLimit: (n: number) => void, setNumQuestions: (x: number) => void}) {
  return (
      <div>
        <h3>Enter Quiz Settings:</h3>
        <label>
          Enter time limit in seconds:
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
          Enter number of questions
          <input 
            type="number"
            value={props.numQuestions ?? ''}
            onChange={(e) => {
              props.setNumQuestions(parseInt(e.target.value));
            }}
          />
        </label>       
        <br/><br/>
      </div>
    )
  }


/*
export interface EnterSettingsProps {
  timeLimit: number;
  numQuestions: number;
  upperBound: number;
  lowerBound: number; 
  updateSettings: any;
}
*/


//Quiz settings must be custom entered or the default settings accepted before quiz is started
export function EnterSettingsOld(props: {timeLimit: number, setTimeLimit: (n: number) => void, setDoneSettings: (b: boolean) => void}) {
  return (
      <div>
        <h3>Enter Quiz Settings:</h3>
        <label>
          Enter time limit in seconds:
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
          Enter number of questions
          <input 
            type="number"
            //value={props.numQuestions ?? ''}
            onChange={(e) => {
              
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
