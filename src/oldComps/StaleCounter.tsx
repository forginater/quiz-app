import React, { useEffect } from 'react';


/*
We can express the problem of a stale closure within a simple counter application 
    that updates the count after a second using the setTimeout function.
Because setTimeout creates a closure, 
    we are accessing a stale value of our state variable, 
    count, when we call setCount. 
The problem is apparent when we run our application. 
    Despite clicking the button multiple times, 
    it is still only incremented by one every second:
What happened to the other 
    */
export function StaleCounter() {
  const [count, setCount] = React.useState(0);

  const [innerCount,setInnerCount] = React.useState(0);

  const [freshCount, setFreshCount] = React.useState(0);


  //Count total application renders
  const renderCount = React.useRef(0);
  //Count each time delayAddOne() is called
  const timeOutCount = React.useRef(0);

  //Create the renderCount side effects
  useEffect(() => {
    renderCount.current += 1;
  })

  useEffect(() => {
    timeOutCount.current += 1;
  },[innerCount])

  //setCount() will update 1 second after click. Let's check out the render count
  function delayAddOne() {
    //Counting the renders of this function, regardless of how many actually update state
    setInnerCount(innerCount+1);
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }

  function freshAddOne() {
    setTimeout(() => {
      setFreshCount((prev => prev + 1));
    }, 1000);

  }
 
  return (
    <>
      <h1>Avoid Stale state by referencing prevState within setState() function</h1>
        <label>
            Click to invoke  with a setTimeout(setCount(count + 1)) after 1 second
            <br/>
            <button onClick={freshAddOne}>+ 1</button>
        </label>
        <h1>freshCount {freshCount}</h1>

    <hr/><hr/><hr/><hr/><hr/><hr/>
      <h1>Stale State issues demonstration:</h1>
        <label>
            Click to invoke delayAddOne() with a setTimeout(setCount(count + 1)) after 1 second
            <br/>
            <button onClick={delayAddOne}>+ 1</button>
        </label>



      <h1>Count: {count}</h1>
      <h3>Count is updated asynchronously by button after 1 second</h3>
      <h3>Multiple clicks within 1 second have no effect</h3>
      <h3>This is a count of number of times setCount() has been called according to this render version</h3>
      
      <h1>RenderCount: {renderCount.current}</h1>
      <h3>Count the total number of application renders</h3>
      <h1>timeOutCount: {timeOutCount.current}</h1>
      <h3>Count the number of times delayAddOne() function has been called</h3>
      <h3>Each click will increment innerCount... even if those setTimeout()s are lost </h3>


    </>

  );
}