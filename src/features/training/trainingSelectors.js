export const filterExercises=(exercises,direction='all')=>exercises.filter(x=>direction==='all'||x.direction===direction);
export const canMove=(index,length,delta)=>index+delta>=0&&index+delta<length;
