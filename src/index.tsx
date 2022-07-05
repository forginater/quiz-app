import React from 'react';
import memo from 'react';
import { useState, useEffect, useRef } from 'react';

import {MutateState} from './oldComps/MutateState';
import {StaleCounter} from './oldComps/StaleCounter';
import {Outer} from './oldComps/StateDemonstration';
import {Demo} from './oldComps/memoTutorial';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';




const app = <App />;

//tutorial demonstrations
const mutateState = <MutateState />
const staleCounter = <StaleCounter />
const stateDemonstration = <Outer />
const memoTutorial = <Demo />

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
