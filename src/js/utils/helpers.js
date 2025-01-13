export const $ = (id) => document.getElementById(id);

export const clearAllTimeouts =  (timeoutIds) => {
    console.log('clearAllTimeouts', timeoutIds)
    while(timeoutIds.length){
      clearTimeout(timeoutIds.pop());
    }

    console.log('CLEARED', timeoutIds)
}