import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';

export interface EnterSettingsProps {
  timeLimit: number; 
  numQuestions: number;
  lowerBound: number;
  upperBound: number
  setTimeLimit: (n: number) => void; 
  setNumQuestions: (x: number) => void;
  setLowerBound: (n: number) => void;
  setUpperBound: (n: number) => void;
}

//Quiz settings must be custom entered or the default settings accepted before quiz is started
export function EnterSettings(props: EnterSettingsProps) {
  return (
      <div>
        <h3>Enter Quiz Settings: SUCK MA BALL</h3>
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
          Enter number of questions:
          <input 
            type="number"
            value={props.numQuestions ?? ''}
            onChange={(e) => {
              props.setNumQuestions(parseInt(e.target.value));
            }}
          />
        </label>       
        <br/><br/>
        <label>
          Enter lower bound:
          <input 
            type="number"
            value={props.lowerBound ?? ''}
            onChange={(e) => {
              props.setLowerBound(parseInt(e.target.value));
            }}
          />
        </label>  
        <br/><br/>
        <label>
          Enter Upper bound:
          <input 
            type="number"
            value={props.upperBound ?? ''}
            onChange={(e) => {
              props.setUpperBound(parseInt(e.target.value));
            }}
          />
        </label>  
        <br/><br/>
      </div>
    )
  }

