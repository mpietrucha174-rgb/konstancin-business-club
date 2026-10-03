import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {COLORS} from './engine.mjs';
import {developmentKind} from './scene-layout.mjs';

// Actual scene geometry: the same building models are used for every owner.
export function createModelFactory(){
 const materials=new Map(),geometries=new Set();
 const material=(color,roughness=.64)=>{const key=color+':'+roughness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness}));return materials.get(key);};
 const unit=new THREE.BoxGeometry(1,1,1);geometries.add(unit);
 function box(group,x,y,z,w,h,d,color){const m=new THREE.Mesh(unit,material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=m.receiveShadow=true;group.add(m);return m;}
 function mesh(group,geometry,color,x=0,y=0,z=0){geometries.add(geometry);const m=new THREE.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;group.add(m);return m;}
 function roof(group,x,y,z,w,d,color){const m=mesh(group,new THREE.ConeGeometry(1,.4,4),color,x,y,z);m.rotation.y=Math.PI/4;m.scale.set(w/Math.SQRT2,1,d/Math.SQRT2);}
 function windows(group,x,y,z,w,h,d,rows=1){for(let row=0;row<rows;row++)for(const side of [-1,1]){
  box(group,x+side*w*.25,y+row*.23,z+d/2+.006,.11,.13,.015,'#334451');
  box(group,x+w/2+.006,y+row*.23,z+side*d*.25,.015,.13,.11,'#334451');
 }}
 function optimize(group){
  group.updateMatrixWorld(true);const buckets=new Map();
  group.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);let bucket=buckets.get(o.material);if(!bucket){bucket=[];buckets.set(o.material,bucket);}bucket.push(geo);});
  const result=new THREE.Group();
  for(const [mat,parts] of buckets){const geometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());geometries.add(geometry);const m=new THREE.Mesh(geometry,mat);m.castShadow=m.receiveShadow=true;result.add(m);}
  return result;
 }
 function building(tile,prop){
  const group=new THREE.Group(),color=prop.mortgaged?'#88939f':COLORS[prop.owner]||'#a9c0c4',kind=developmentKind(tile,prop);
  group.userData={kind,owner:prop.owner,level:prop.level};
  if(kind==='vacant')return group;
  box(group,0,.035,0,1.3,.07,.9,color);
  if(kind==='station'){
   box(group,0,.25,0,1.13,.36,.58,'#f9f4e4');box(group,0,.48,0,1.3,.14,.7,color);
   box(group,0,.22,.303,.7,.19,.024,'#334451');box(group,-.45,.17,.34,.11,.25,.1,color);box(group,.45,.17,.34,.11,.25,.1,color);
  }else if(kind==='utility'){
   mesh(group,new THREE.CylinderGeometry(.3,.3,.64,12),color,0,.39,0);mesh(group,new THREE.CylinderGeometry(.38,.38,.14,12),'#f9f4e4',0,.79,0);
   roof(group,0,.95,0,.85,.85,color);box(group,0,.39,.307,.16,.21,.018,'#334451');
  }else if(kind==='hotel'){
   box(group,0,.75,0,.83,1.4,.59,'#fff8e9');box(group,-.47,.45,0,.27,.8,.65,color);box(group,.47,.45,0,.27,.8,.65,color);
   box(group,0,1.5,0,.96,.12,.72,color);box(group,0,1.69,0,.56,.25,.13,color);
   windows(group,0,.39,0,.83,1.4,.59,5);box(group,0,.22,.32,.16,.3,.03,color);
  }else if(kind==='apartments'){
   const height=prop.level===3?1.72:1.28;
   box(group,0,height/2+.08,0,.94,height,.63,'#fff8e9');box(group,0,height+.12,0,1.06,.14,.75,color);box(group,0,height+.26,0,.58,.17,.4,color);
   box(group,-.42,height/2+.08,.335,.1,height,.04,color);windows(group,0,.33,0,.94,height,.63,prop.level===3?6:4);
   box(group,0,.22,.33,.19,.31,.03,color);
  }else{
   const w=kind==='villa'?.91:.73,h=kind==='villa'?.65:.48;
   box(group,0,h/2+.09,0,w,h,.59,'#fff8e9');roof(group,0,h+.22,0,w+.17,.83,color);
   windows(group,0,.34,0,w,h,.59,kind==='villa'?2:1);box(group,0,.23,.312,.16,.29,.035,color);
   box(group,-w*.25,h+.23,-.1,.1,.33,.12,'#ead9bc');
  }
  const result=optimize(group);result.userData=group.userData;return result;
 }
 function pawn(id){
  const group=new THREE.Group(),color=COLORS[id],skin=['#f1ba8e','#c98e66','#f4c79e','#e1ae83'][id];
  mesh(group,new THREE.CylinderGeometry(.30,.34,.09,24),color,0,.05,0);
  // Oversized head and compact suit silhouette stay recognizable at board scale.
  box(group,-.105,.22,0,.13,.29,.14,'#304255');box(group,.105,.22,0,.13,.29,.14,'#304255');
  box(group,-.105,.095,.065,.16,.11,.25,'#263346');box(group,.105,.095,.065,.16,.11,.25,'#263346');
  const jacket=mesh(group,new THREE.CylinderGeometry(.19,.23,.36,8),color,0,.51,0);jacket.scale.z=.65;
  box(group,0,.54,.135,.15,.28,.025,'#fff9df');
  box(group,0,.54,.154,.05,.22,.012,color);
  mesh(group,new THREE.SphereGeometry(.08,12,8),skin,-.26,.38,0);mesh(group,new THREE.SphereGeometry(.08,12,8),skin,.26,.38,0);
  const left=box(group,-.23,.5,0,.12,.3,.15,color);left.rotation.z=-.18;
  const right=box(group,.23,.5,0,.12,.3,.15,color);right.rotation.z=.18;
  mesh(group,new THREE.SphereGeometry(.25,20,16),skin,0,.92,0).scale.set(1,1.15,.9);
  for(const x of [-.083,.083]){mesh(group,new THREE.SphereGeometry(.039,10,8),'#fffefa',x,.94,.203);mesh(group,new THREE.SphereGeometry(.023,10,8),'#253142',x,.94,.234);}
  mesh(group,new THREE.SphereGeometry(.047,10,8),skin,0,.87,.237);
  box(group,0,.805,.208,.085,.022,.012,'#985d47');
  mesh(group,new THREE.SphereGeometry(.257,20,12),'#4b3b36',0,1.06,-.025).scale.set(1,.55,.95);
  mesh(group,new THREE.CylinderGeometry(.29,.29,.035,24),color,0,1.13,0);
  mesh(group,new THREE.CylinderGeometry(.2,.22,.21,16),color,0,1.24,-.02);
  mesh(group,new THREE.CylinderGeometry(.219,.226,.055,16),'#fff4d8',0,1.17,-.02);
  const result=optimize(group);result.userData={id};return result;
 }

 return {building,pawn,material,box,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
