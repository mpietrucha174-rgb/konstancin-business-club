import test from 'node:test';
import assert from 'node:assert/strict';
import {BOARD,FIELD,EVENTS,LEGACY_BOARD_MAP,newGame,dispatch,upgradeGame,validSave,rent} from '../game/engine.mjs';
import {boardCoordinates} from '../game/board-layout.mjs';
import {createRoomData,upgradeRoomData,applyRoomAction} from '../game/rooms.mjs';
const L=i=>LEGACY_BOARD_MAP[i];
function legacyGame(){const s=newGame({seed:20});delete s.boardRevision;s.props=Array.from({length:32},()=>({owner:null,level:0,mortgaged:false}));s.players.forEach((p,i)=>{p.position=[4,8,16,31][i];});return s;}
test('40-field route keeps corners, has six event fields and supports four transport rents',()=>{
 assert.equal(BOARD.length,40);assert.deepEqual([0,10,20,30].map(i=>BOARD[i].type),['start','jail','parking','police']);
 assert.equal(BOARD.filter(b=>b.type==='property').length,22);assert.equal(BOARD.filter(b=>b.deck==='chance').length,3);assert.equal(BOARD.filter(b=>b.deck==='chest').length,3);
 const stations=BOARD.flatMap((b,i)=>b.type==='station'?[i]:[]);assert.equal(stations.length,4);const s=newGame({seed:2});
 for(const [n,i] of stations.entries()){s.props[i].owner=0;assert.equal(rent(s,stations[0]),25*2**n);}
});
test('40 visual fields occupy unique adjoining cells around the 11 by 11 board',()=>{
 const coords=BOARD.map((_,i)=>boardCoordinates(i,BOARD.length));assert.equal(new Set(coords.map(c=>`${c.row}:${c.col}`)).size,40);
 assert.deepEqual([0,10,20,30].map(i=>coords[i]),[{row:11,col:11},{row:11,col:1},{row:1,col:1},{row:1,col:11}]);
 coords.forEach((c,i)=>{const next=coords[(i+1)%coords.length];assert.equal(Math.abs(c.row-next.row)+Math.abs(c.col-next.col),1);assert.ok(c.row===1||c.row===11||c.col===1||c.col===11);});
});
test('32-field saves retain positions, ownership, buildings, mortgages and card destinations',()=>{
 const s=legacyGame();s.props[5]={owner:0,level:2,mortgaged:false};s.props[31]={owner:1,level:0,mortgaged:true};s.status='event';s.event={...EVENTS.find(e=>e.cardId===32),teleport:4};const original=JSON.stringify(s);
 assert.ok(validSave(s));const result=upgradeGame(s);assert.equal(JSON.stringify(s),original);assert.ok(validSave(result));assert.equal(result.props.length,40);
 assert.deepEqual(result.players.map(p=>p.position),[5,10,20,39]);assert.deepEqual(result.props[L(5)],s.props[5]);assert.deepEqual(result.props[L(31)],s.props[31]);assert.equal(result.event.teleport,FIELD.stocer);assert.deepEqual(upgradeGame(result),result);
 const resolved=dispatch(result,{action:'event'});assert.equal(resolved.players[0].position,FIELD.stocer);assert.equal(resolved.players[0].cash,1425);
});
test('ongoing auctions, debt moves and accepted online trade survive board expansion',()=>{
 let s=legacyGame();s.status='auction';s.auction={i:31,bid:20,leader:0,passed:[],current:1};const upgraded=upgradeGame(s);assert.equal(upgraded.auction.i,39);assert.equal(upgraded.auction.bid,20);
 s=legacyGame();s.status='debt';s.players[0].position=8;s.players[0].cash=-50;s.players[0].jail=0;s.props[1].owner=0;s.debt={id:0,creditor:null,resume:'end',afterMove:7};s=upgradeGame(s);assert.equal(s.debt.afterMove,9);
 s=dispatch(s,{action:'property',i:1,kind:'mortgage'});assert.equal(s.players[0].position,L(15));assert.equal(s.status,'purchase');
 let d=createRoomData('Host','h',{count:2});d.members.push({seat:1,name:'Guest',tokenHash:'g'});d.phase='playing';d.state=legacyGame();d.state.props[4].owner=0;d.state.props[31].owner=1;d.pending={from:0,to:1,offer:{to:1,give:[4],get:[31],giveCash:0,getCash:0}};
 const prepared=upgradeRoomData(d);assert.deepEqual(prepared.pending.offer.give,[5]);assert.deepEqual(prepared.pending.offer.get,[39]);
 const accepted=applyRoomAction(prepared,1,{op:'reply',accept:true},100);assert.equal(accepted.state.props[5].owner,1);assert.equal(accepted.state.props[39].owner,0);assert.equal(accepted.state.props.length,40);
});
