
//genRandNum() generates a random integer in the inclusive range between 'min' and 'max'
export function genRandNum(min: number, max: number): number {
    //delta = magnitude of the range from min to max 
    const delta = max-min;
    //Generate a random floating-point num in range 0 (inclusive) to 1 (excluding)
    const randNum = Math.random();
    //Scale randNum to fall within delta range
    const randScaled = randNum * (delta + 1);
    //translate randScaled so it's in the range between min and max
    const randTranslated = randScaled + min;
    //round down to integer
    const floored = Math.floor(randTranslated);
    return floored;
  }
  
  //Test genRandNum() to confirm numbers fall within range
  function testRandFunc() {
   for (let i=0; i<30; i++) {
    console.log(i,": ",genRandNum(0,10));
   }
  }
  
