import * as THREE from 'three';
import {fitBoardCamera} from '../game/board-camera.mjs';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {BOARD,GROUPS,COLORS} from '../game/engine.mjs';
import {fieldPosition,fieldRotation,pawnPosition,movementFields} from '../game/scene-layout.mjs';
import {createModelFactory} from '../game/scene-models.mjs';

const FACE_VALUES=[1,6,2,5,3,4];
const UP=new THREE.Vector3(0,1,0);
const NORMALS=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const money=n=>`${n} zł`;
const ease=t=>t*t*(3-2*t);

export function createBoardScene(host,callbacks={}){
 const scene=new THREE.Scene(),factory=createModelFactory(),geometries=new Set(),textures=new Set(),materials=new Set();
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2.5));
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;renderer.toneMappingExposure=1;
 renderer.domElement.setAttribute('aria-label','Plansza 3D ze stałą kamerą. Kliknij pole, aby zobaczyć szczegóły.');
 renderer.domElement.setAttribute('role','img');host.append(renderer.domElement);
 const camera=new THREE.OrthographicCamera(-19,19,15,-15,.1,150);
 scene.add(new THREE.HemisphereLight('#ffffff','#8b9baa',1.8));
 const sun=new THREE.DirectionalLight('#fff6e6',2.5);sun.position.set(-12,27,15);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-17,right:17,top:17,bottom:-17,near:1,far:70});
 sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;scene.add(sun);
 const fill=new THREE.DirectionalLight('#daeaff',.7);fill.position.set(14,12,-15);scene.add(fill);
 const mat=(color,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.8,...extra});materials.add(m);return m;};
 const geo=g=>{geometries.add(g);return g;};
 function mesh(g,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,color,x,y,z){return mesh(geo(new THREE.BoxGeometry(w,h,d)),mat(color),x,y,z);}
 function canvasTexture(width,height,draw){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');draw(ctx,width,height);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.add(t);return t;}
 function plane(texture,w,h,x,y,z,rotation=0){const m=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});materials.add(m);const o=mesh(geo(new THREE.PlaneGeometry(w,h)),m,x,y,z);o.rotation.set(-Math.PI/2,0,rotation);return o;}
 const slab=mesh(geo(new RoundedBoxGeometry(22.6,.6,22.6,3,.16)),mat('#887b70'),0,-.22,0);slab.castShadow=true;
 mesh(geo(new RoundedBoxGeometry(22.55,.16,22.55,3,.09)),mat('#d2c5b8'),0,.14,0);
 box(18.05,.1,18.05,'#9eb85a',0,.28,0);
 // Clean inset lawn and a simple white rim keep the playing route distinct.
 for(const [w,d,x,z] of [[18.1,.12,0,8.95],[18.1,.12,0,-8.95],[.12,17.8,8.95,0],[.12,17.8,-8.95,0]])box(w,.03,d,'#eff8d9',x,.34,z);
 const centerTexture=canvasTexture(1024,1024,(ctx,w,h)=>{
  ctx.fillStyle='#b6cd6a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#c3d77c';ctx.lineWidth=17;
  for(let n=-1024;n<2048;n+=220){ctx.beginPath();ctx.moveTo(n,0);ctx.lineTo(n+1024,1024);ctx.stroke();ctx.beginPath();ctx.moveTo(n,0);ctx.lineTo(n-1024,1024);ctx.stroke();}
  ctx.strokeStyle='#737c79';ctx.lineWidth=64;ctx.strokeRect(22,22,980,980);
  ctx.strokeStyle='#e6e0ce';ctx.lineWidth=3;ctx.setLineDash([22,20]);ctx.strokeRect(22,22,980,980);ctx.setLineDash([]);
  // Small flat grass flecks give the lawn scale without competing with fields.
  for(let i=0;i<85;i++){const x=90+(i*193%840),y=90+(i*277%840);ctx.fillStyle=i%3?'#d5e498':'#92ad53';ctx.beginPath();ctx.ellipse(x,y,3+i%3,2,0,0,7);ctx.fill();}
 });plane(centerTexture,17.6,17.6,0,.344,0);
 // Table props sit outside the playable route and never intercept field picking.
 function bankBundle(x,z,rotation=0){
  const g=new THREE.Group();g.position.set(x,-.05,z);g.rotation.y=rotation;scene.add(g);
  for(let stack=0;stack<3;stack++)for(let n=0;n<6-stack;n++){
   const note=mesh(geo(new THREE.BoxGeometry(.85,.055,1.5)),mat(n%2?'#83aa60':'#aed281'),stack*.88,n*.075,0,g);note.castShadow=true;
   mesh(geo(new THREE.BoxGeometry(.21,.018,1.51)),mat('#f6e9ac'),stack*.88,n*.075+.037,0,g);
  }
 }
 bankBundle(-4,-13.2,-.15);bankBundle(13.2,3,.2);
 const tileGeometry=geo(new RoundedBoxGeometry(1.96,.18,1.96,2,.035)),tileMeshes=[],developments=[],signatures=[];
 const vacantMat=mat('#eee6df'),activeMat=mat('#fff0b5'),hoverMat=mat('#d0edfa');
 for(const [index,tile] of BOARD.entries()){
  const {x,z}=fieldPosition(index),a=fieldRotation(index),g=new THREE.Group();g.position.set(x,.27,z);g.rotation.y=a;scene.add(g);
  const m=mesh(tileGeometry,vacantMat,0,0,0,g);m.userData.field=index;tileMeshes.push(m);
  const strip=mesh(geo(new THREE.BoxGeometry(1.86,.035,.9)),mat(tile.group!==undefined?GROUPS[tile.group].color:tile.type==='event'?'#ecb644':'#70bcb1'),0,.11,-.47,g);strip.userData.field=index;
  if(!tile.price){
   const special=canvasTexture(256,256,(ctx,w,h)=>{
    ctx.clearRect(0,0,w,h);
    if(tile.type==='event'){
     const palette=['#f6c846','#e86576','#599bd1','#a1cb61','#b683c3','#65c9c4'];
     for(let j=0;j<12;j++){ctx.beginPath();ctx.moveTo(128,128);ctx.arc(128,128,102,j*Math.PI/6,(j+1)*Math.PI/6);ctx.closePath();ctx.fillStyle=palette[j%6];ctx.fill();}
     ctx.fillStyle='#fff9e8';ctx.beginPath();ctx.arc(128,128,35,0,7);ctx.fill();ctx.fillStyle='#566375';ctx.font='bold 48px sans-serif';ctx.textAlign='center';ctx.fillText('?',128,145);
    }else {ctx.fillStyle=tile.type==='start'?'#5dba78':tile.type==='jail'?'#ea886a':'#76bace';ctx.beginPath();ctx.roundRect(24,24,208,208,30);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 125px sans-serif';ctx.fillText(tile.type==='start'?'➜':tile.type==='parking'?'Ⅱ':tile.type==='jail'?'!':tile.type==='tax'?'−':'!',128,132);}
   });const icon=plane(special,1.05,1.05,x-Math.sin(a)*.34,.39,z-Math.cos(a)*.34,a);
  }
  const buildings=new THREE.Group();buildings.userData.field=index;buildings.position.set(x,.365,z);buildings.rotation.y=a;scene.add(buildings);developments.push(buildings);
 }
 const markers=COLORS.map(color=>mat(color,{transparent:true,opacity:.28}));
 const markerGeometry=geo(new THREE.RingGeometry(.29,.4,32));
 const pawns=COLORS.map((_,id)=>{const group=factory.pawn(id);scene.add(group);group.position.y=.42;return group;});
 const selection=mesh(geo(new THREE.RingGeometry(.77,.89,4)),mat('#ffe174',{side:THREE.DoubleSide,transparent:true,opacity:.9}),0,.4,0);selection.rotation.x=-Math.PI/2;selection.rotation.z=Math.PI/4;
 const pawnRings=COLORS.map((_,id)=>{const ring=mesh(markerGeometry,markers[id],0,.368,0);ring.rotation.x=-Math.PI/2;return ring;});
 const diceTextures=Array.from({length:6},(_,i)=>canvasTexture(128,128,ctx=>{
  ctx.fillStyle='#fffdf3';ctx.fillRect(0,0,128,128);ctx.fillStyle='#244a65';
  const patterns=[[[0,0]],[[-1,-1],[1,1]],[[-1,-1],[0,0],[1,1]],[[-1,-1],[1,-1],[-1,1],[1,1]],[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]];
  patterns[i].forEach(([x,y])=>{ctx.beginPath();ctx.arc(64+x*33,64+y*33,10,0,Math.PI*2);ctx.fill();});
 }));
 const diceMaterials=FACE_VALUES.map(v=>{const m=new THREE.MeshStandardMaterial({map:diceTextures[v-1],roughness:.36});materials.add(m);return m;});
 const dice=Array.from({length:2},(_,i)=>{const d=mesh(geo(new THREE.BoxGeometry(1.25,1.25,1.25)),diceMaterials,i?1.02:-1.02,1.01,2);d.castShadow=true;return d;});
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 let disposed=false,frame=0,previous=null,hovered=-1,selected=-1,preview=false,motion=null,motionNotified=false,spinning=false,diceEnd=0,fast=false,rollStart=0;
 let lastTick=0,targetDice=[1,1],reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 const notifyMotion=value=>{if(motionNotified!==value){motionNotified=value;callbacks.onMotion?.(value);}};
 function applyHighlights(){tileMeshes.forEach((m,i)=>{m.material=i===hovered?hoverMat:i===selected?activeMat:vacantMat;});}
 function resize(){
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h);fitBoardCamera(camera,w,h);
  callbacks.onLayout?.(BOARD.map((tile,i)=>{const {x,z}=fieldPosition(i),a=fieldRotation(i);
   // Flip the far-side names so every label faces the viewer.
   const angle=i>=20?a+Math.PI:a;
   const cx=x+Math.sin(a)*.59,cz=z+Math.cos(a)*.59;
   const project=(u,v)=>{const pt=new THREE.Vector3(cx+Math.cos(angle)*u+Math.sin(angle)*v,.405,cz-Math.sin(angle)*u+Math.cos(angle)*v).project(camera);return {x:(pt.x+1)*w/2,y:(1-pt.y)*h/2};};
   const origin=project(-.93,-.38),right=project(.93,-.38),bottom=project(-.93,.38);
   return {transform:`matrix(${(right.x-origin.x)/180},${(right.y-origin.y)/180},${(bottom.x-origin.x)/76},${(bottom.y-origin.y)/76},${origin.x},${origin.y})`};
  }));
 }
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 function pick(event){const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);let hit=raycaster.intersectObjects([...tileMeshes,...developments],true)[0]?.object;while(hit){if(Number.isInteger(hit.userData.field))return hit.userData.field;hit=hit.parent;}return -1;}
 let down=null;
 const onDown=e=>{down={x:e.clientX,y:e.clientY,id:e.pointerId};};
 const onUp=e=>{if(down?.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const i=pick(e);if(i>=0)callbacks.onSelect?.(i);}down=null;};
 const onMove=e=>{if(e.buttons)return;const i=pick(e);if(i!==hovered){hovered=i;applyHighlights();callbacks.onHover?.(i);renderer.domElement.style.cursor=i>=0?'pointer':'default';}};
 const onLeave=()=>{hovered=-1;applyHighlights();callbacks.onHover?.(-1);};
 const onCancel=()=>{down=null;};
 const onContextLost=e=>{e.preventDefault();callbacks.onError?.('Widok 3D został przerwany. Możesz kontynuować na planszy 2D.');};
 const handlers={pointerdown:onDown,pointerup:onUp,pointermove:onMove,pointerleave:onLeave,pointercancel:onCancel,webglcontextlost:onContextLost};
 for(const [event,fn] of Object.entries(handlers))renderer.domElement.addEventListener(event,fn);
 function setPawn(id,index){const p=pawnPosition(index,id);pawns[id].position.set(p.x,.42,p.z);pawnRings[id].position.set(p.x,.368,p.z);}
 function update(state,options={}){
  if(disposed)return;const now=performance.now();const modeChanged=preview!==!!options.preview;fast=!!options.fast;preview=!!options.preview;selected=options.selected??-1;
  if(modeChanged||!state.lastMove&&motion){motion=null;spinning=false;diceEnd=0;notifyMotion(false);}
  const newMove=state.lastMove&&JSON.stringify(state.lastMove)!==JSON.stringify(previous?.lastMove);
  const rolled=previous&&!preview&&previous.status==='roll'&&(state.status!=='roll'||newMove);
  if(options.rolling&&!spinning){rollStart=now;spinning=true;}
  if(!options.rolling&&spinning){spinning=false;diceEnd=now+(reduced?0:340);}
  if(rolled){rollStart=now;diceEnd=now+(reduced?0:fast?240:650);}
  targetDice=state.dice;
  if(newMove&&previous&&!preview){
   const move=state.lastMove,route=movementFields(move);motion={id:move.id,route,from:move.from,start:Math.max(now,diceEnd),duration:reduced?0:fast?65:145};
   setPawn(move.id,move.from);notifyMotion(true);
  }
  if(!state.lastMove&&previous?.lastMove&&!motion)notifyMotion(false);
  state.players.forEach(p=>{pawns[p.id].visible=pawnRings[p.id].visible=!p.bankrupt;if(motion?.id!==p.id)setPawn(p.id,p.position);});
  for(let id=state.players.length;id<4;id++)pawns[id].visible=pawnRings[id].visible=false;
  state.props.forEach((p,i)=>{
   const signature=`${p.owner}/${p.level}/${p.mortgaged}`;if(signature===signatures[i])return;
   const container=developments[i];while(container.children.length){const child=container.children[0];container.remove(child);child.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}
   signatures[i]=signature;
   if(p.owner!==null){const building=factory.building(BOARD[i],p);building.position.z=-.43;building.scale.setScalar(1.07);container.add(building);container.userData.growAt=previous&&!reduced?now:0;
    const ownerPlate=mesh(geo(new THREE.BoxGeometry(1.84,.027,.07)),mat(COLORS[p.owner]),0,.007,.89,container);ownerPlate.userData.field=i;
   }
  });
  const activePlayer=state.players[state.turn],pos=fieldPosition(activePlayer.position);selection.position.set(pos.x,.365,pos.z);selection.visible=!preview;
  applyHighlights();previous=state;
 }
 function settleDice(d,i){const v=targetDice?.[i]||1;const normal=new THREE.Vector3(...NORMALS[FACE_VALUES.indexOf(v)]);d.quaternion.setFromUnitVectors(normal,UP);d.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(UP,i?.22:-.18));d.position.set((i?1.02:-1.02)+(preview?0:-3),1.01,preview?2:-3);}
 function animate(now){
  if(disposed)return;frame=requestAnimationFrame(animate);if(document.hidden||now-lastTick<1000/45)return;const dt=Math.min(.06,(now-lastTick)/1000);lastTick=now;
  let isMoving=false;
  if(motion){
   const elapsed=now-motion.start,step=motion.duration?Math.floor(Math.max(0,elapsed)/motion.duration):motion.route.length;
   if(step>=motion.route.length){setPawn(motion.id,motion.route.at(-1));motion=null;}
   else if(elapsed>=0){const p=pawns[motion.id],from=pawnPosition(step?motion.route[step-1]:motion.from,motion.id),to=pawnPosition(motion.route[step],motion.id),fraction=(elapsed%motion.duration)/motion.duration,t=ease(fraction);
    p.position.set(THREE.MathUtils.lerp(from.x,to.x,t),.42+Math.sin(fraction*Math.PI)*.52,THREE.MathUtils.lerp(from.z,to.z,t));p.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);
    pawnRings[motion.id].position.set(p.position.x,.368,p.position.z);
   }
   isMoving=!!motion;
  }
  const rolling=(spinning||now<diceEnd)&&!reduced;
  dice.forEach((d,i)=>{if(rolling){d.rotation.x+=dt*(7+i);d.rotation.y+=dt*(9-i);d.rotation.z+=dt*4;d.position.y=1.12+Math.abs(Math.sin((now-rollStart)/140+i))*.85;d.position.x=(preview?0:-3)+(i?1:-1)*(1.02+Math.sin(now/150)*.28);d.position.z=preview?2:-3;}else settleDice(d,i);});
  developments.forEach(g=>{const t=g.userData.growAt;if(!t)return;const p=Math.min(1,(now-t)/480);g.scale.y=.05+.95*(1-Math.pow(1-p,3));if(p===1)g.userData.growAt=0;});
  if(previous&&!preview){const color=COLORS[previous.turn];selection.material.color.set(color);selection.material.opacity=reduced?.8:.62+Math.sin(now/350)*.2;}
  notifyMotion(isMoving||rolling);renderer.render(scene,camera);
 }
 frame=requestAnimationFrame(animate);
 return {update,
  dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();for(const [event,fn] of Object.entries(handlers))renderer.domElement.removeEventListener(event,fn);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());factory.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();notifyMotion(false);}
 };
}
