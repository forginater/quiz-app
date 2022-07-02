import React from 'react';
import memo from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';


////////////////////////////////////////////////////////////////////////
export const Demo = () => {
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState(["todo 1", "todo 2"]);
  
    const increment = () => {
      setCount((c) => c + 1);
    };
  
    return (
      <>
        <Todos todos={todos} />
        {memoFunc({todos: todos})}
        <hr />
        <div>
          Count: {count}
          <button onClick={increment}>+</button>
        </div>
        
      </>
    );
  };
  
  
  function Todos(props: { todos: any }) {
    console.log("child render");
    return (
      <>
        <h2>My Todos</h2>
        {props.todos.map((todo: any, index: number) => {
          return <p key={index}>{todo}</p>;
        })}
      </>
    );
  };

/* However, once we wrap the Todos component in React.memo 
(which is a higher-order function, meaning it accepts a function as an argument), 
it no longer re-renders unnecessarily when our parent component does. */
export const memoFunc = React.memo((props: any) => {
  console.log("rerendering Todo component!");
  return (
    <>
      <h2>My Todos</h2>
      {props.todos.map((todo: any, index: number) => {
        return <p key={index}>{todo}</p>;
      })}
    </>
  );
});




  
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  //Memoise Todos component
  const todosMemoised = React.memo(Todos);

  //Adding a comparisonFunc (to determine when to rerender)
  const todosMemo = React.memo(Todos, comparisonFunc);
  
  function comparisonFunc(prevProps: any,nextProps: any): boolean {
    return true;
  }
  

  ////////////////////////////////////////////////////////////////////////
  //Attempted to define a memoized function in a way which could then accept props.
  //Caused errors, folowing solutions are probably wrong
  //online tutorials seem to not use props, or export as part of separate file
  const smuggle = React.memo(function Todos(props: { todos: any }) {
    console.log("child render");
    return (
      <>
        <h2>My Todos</h2>
        {props.todos.map((todo: any, index: number) => {
          return <p key={index}>{todo}</p>;
        })}
      </>
    );
  });
  
  const passProps = (props: any) => {
    return React.memo(function Todos(props: any) {
      console.log("child render");
      return (
        <>
          <h2>My Todos</h2>
          {props.todos.map((todo: any, index: number) => {
            return <p key={index}>{todo}</p>;
          })}
        </>
      );
    });
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  
