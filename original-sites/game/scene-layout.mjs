import {boardCoordinates} from './board-layout.mjs';

export const TILE_SPACING=2;
export function fieldPosition(index,count=40){
 const {row,col}=boardCoordinates(index,count),middle=count/8+1;
 return {x:(col-middle)*TILE_SPACING,z:(row-middle)*TILE_SPACING};
}
export function fieldRotation(index,count=40){
 const side=count/4;
 return index<side?0:index<side*2?Math.PI/2:index<side*3?Math.PI:-Math.PI/2;
}
export function pawnPosition(index,id,count=40){
 const p=fieldPosition(index,count),a=fieldRotation(index,count);
 const x=(id%2-.5)*.48,z=Math.floor(id/2)*.34+.17;
 return {x:p.x+x*Math.cos(a)+z*Math.sin(a),z:p.z-x*Math.sin(a)+z*Math.cos(a)};
}
export function movementFields(move,count=40){
 if(!move)return [];
 if(!move.steps)return [move.to];
 const route=Array.from({length:Math.min(Math.abs(move.steps),count)},(_,n)=>(move.from+Math.sign(move.steps)*(n+1)+count*2)%count);
 if(route.at(-1)!==move.to)route.push(move.to);
 return route;
}
export function developmentKind(tile,property){
 if(property.owner===null)return 'vacant';
 if(tile.type==='station')return 'station';
 if(tile.type==='utility')return 'utility';
 return property.level>=4?'hotel':property.level>=2?'apartments':property.level===1?'villa':'cottage';
}
