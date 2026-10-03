import test from 'node:test';
import {fitBoardCamera} from '../game/board-camera.mjs';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {BOARD,COLORS,newGame} from '../game/engine.mjs';
import {fieldPosition,pawnPosition,movementFields,developmentKind} from '../game/scene-layout.mjs';
import {createModelFactory} from '../game/scene-models.mjs';

test('3D route has 40 unique adjoining fields and distinct positions for four pawns',()=>{
 const all=BOARD.map((_,i)=>fieldPosition(i));assert.equal(new Set(all.map(p=>`${p.x},${p.z}`)).size,40);
 all.forEach((p,i)=>{const q=all[(i+1)%40];assert.equal(Math.hypot(p.x-q.x,p.z-q.z),2);const pawns=COLORS.map((_,id)=>pawnPosition(i,id));assert.equal(new Set(pawns.map(p=>`${p.x},${p.z}`)).size,4);pawns.forEach(t=>{assert.ok(Math.abs(t.x-p.x)<.9);assert.ok(Math.abs(t.z-p.z)<.9);});});
});
test('Animation paths preserve wrap, backward cards and direct teleports',()=>{
 assert.deepEqual(movementFields({from:38,to:3,steps:5}),[39,0,1,2,3]);
 assert.deepEqual(movementFields({from:1,to:38,steps:-3}),[0,39,38]);
 assert.deepEqual(movementFields({from:17,to:5,steps:0}),[5]);
 assert.deepEqual(movementFields({from:1,to:10,steps:2}),[2,3,10]);
 assert.deepEqual(movementFields(null),[]);
});
test('Every owner and building level creates valid geometry in the owner color',()=>{
 const f=createModelFactory(),tile=BOARD.find(b=>b.type==='property');
 try{
  for(let owner=0;owner<4;owner++)for(let level=0;level<5;level++){
   const model=f.building(tile,{owner,level,mortgaged:false});assert.equal(model.userData.owner,owner);assert.equal(model.userData.level,level);
   const colors=new Set();model.traverse(o=>{if(!o.isMesh)return;assert.ok(o.geometry.getAttribute('position').array.every(Number.isFinite));colors.add('#'+o.material.color.getHexString());});assert.ok(colors.has(COLORS[owner]));
   const bounds=new THREE.Box3().setFromObject(model);assert.ok(bounds.max.y>bounds.min.y);assert.ok(bounds.max.x-bounds.min.x<1.94);assert.ok(bounds.max.z-bounds.min.z<1.94);
  }
  for(const type of ['station','utility'])assert.equal(f.building(BOARD.find(b=>b.type===type),{owner:1,level:0}).userData.kind,type);
  assert.equal(f.building(tile,{owner:null,level:0}).children.length,0);
  assert.equal(developmentKind(tile,{owner:2,level:4}),'hotel');
  assert.equal(developmentKind(tile,{owner:2,level:0}),'cottage');
  COLORS.forEach((color,id)=>{const pawn=f.pawn(id);assert.equal(pawn.userData.id,id);const colors=[];pawn.traverse(o=>{if(o.isMesh)colors.push('#'+o.material.color.getHexString());});assert.ok(colors.includes(color));});
 }finally{f.dispose();}
});
test('Default orthographic camera fits the complete board across phone and desktop ratios',()=>{
 for(const [w,h] of [[1000,680],[1600,850],[375,395],[620,560],[320,337]]){
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,150);fitBoardCamera(camera,w,h);
  for(const x of [-11.3,11.3])for(const z of [-11.3,11.3]){const v=new THREE.Vector3(x,2.6,z).project(camera);assert.ok(Math.abs(v.x)<1,`x ${w} ${v.x}`);assert.ok(Math.abs(v.y)<1,`y ${w} ${v.y}`);}
 }
});

test('Resizing restores the fixed camera and leaves every field label inside the frame',()=>{
 const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,150);
 for(const [w,h] of [[1100,680],[375,395],[320,337]]){
  camera.position.set(0,1,0);camera.zoom=3;fitBoardCamera(camera,w,h);
  assert.deepEqual(camera.position.toArray(),[28,30,28]);assert.equal(camera.zoom,1);
  for(let i=0;i<40;i++){const p=fieldPosition(i),v=new THREE.Vector3(p.x,.37,p.z).project(camera);assert.ok(Math.abs(v.x)<.94);assert.ok(Math.abs(v.y)<.94);}
 }
});
