export function boardCoordinates(i,count){
 const side=count/4,edge=side+1;
 if(i<=side)return {row:edge,col:edge-i};
 if(i<=side*2)return {row:side*2+1-i,col:1};
 if(i<=side*3)return {row:1,col:i-side*2+1};
 return {row:i-side*3+1,col:edge};
}
