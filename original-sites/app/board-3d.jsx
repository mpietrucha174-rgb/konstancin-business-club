"use client";
import {useEffect,useRef,useState} from 'react';
import {Layers} from 'lucide-react';
import {BOARD,COLORS,GROUPS,owned} from '../game/engine.mjs';

export default function Board3D({state,preview,rolling,fast,onSelect,onMotion}){
 const host=useRef(null),scene=useRef(null),latest=useRef(null);
 const [ready,setReady]=useState(false),[failure,setFailure]=useState(''),[flat,setFlat]=useState(false),[hover,setHover]=useState(-1),[chosen,setChosen]=useState(0),[labels,setLabels]=useState([]);
 latest.current={state,preview,rolling,fast,onSelect,onMotion};
 useEffect(()=>{
  if(flat)return;let cancelled=false,local;
  import('./board-scene.mjs').then(({createBoardScene})=>{
   if(cancelled)return;
   try{local=createBoardScene(host.current,{onLayout:setLabels,onSelect:i=>{setChosen(i);latest.current.onSelect(i);},onHover:setHover,onMotion:v=>latest.current.onMotion(v),onError:message=>{setFailure(message);setFlat(true);}});scene.current=local;local.update(latest.current.state,{...latest.current,selected:latest.current.state.players[latest.current.state.turn].position});setReady(true);}
   catch(e){console.error('3D board unavailable',e);setFailure('Urządzenie nie uruchomiło widoku 3D. Gra działa na planszy 2D.');setFlat(true);latest.current.onMotion(false);}
  }).catch(e=>{if(cancelled)return;console.error(e);setFailure('Nie udało się wczytać grafiki 3D. Możesz grać w widoku 2D.');setFlat(true);latest.current.onMotion(false);});
  return()=>{cancelled=true;scene.current=null;local?.dispose();};
 },[flat]);
 useEffect(()=>{scene.current?.update(state,{preview,rolling,fast,selected:state.players[state.turn].position});},[state,preview,rolling,fast]);
 const inspect=hover>=0?hover:preview?chosen:state.players[state.turn].position;
 const tile=BOARD[inspect],property=state.props[inspect],owner=property.owner===null?null:state.players[property.owner];
 const choose=i=>{setChosen(i);onSelect(i);};
 return <div className={`world-stage ${flat?'flat-stage':''}`}>
  <div className="world-topline"><span className="world-badge">{preview?'PODGLĄD PLANSZY':`RUNDA ${state.round}${state.maxRounds?' / '+state.maxRounds:''}`}</span><span className="world-badge secondary">{flat?'WIDOK 2D':'WIDOK 3D'} · {BOARD.length} pól</span></div>
  {!flat&&<div className="world-canvas" ref={host}/>}
  {!flat&&!ready&&<div className="scene-loading" role="status"><span/>Przygotowujemy planszę…</div>}
  {failure&&<p className="scene-failure" role="status">{failure}</p>}
  {flat&&<div className="flat-board" aria-label="Plansza 2D">{BOARD.map((b,i)=>{const prop=state.props[i],owner=prop.owner===null?null:state.players[prop.owner];return <button key={i} onClick={()=>choose(i)} style={{'--field-color':owner?.color||(b.group!==undefined?GROUPS[b.group].color:'#a6c1d3')}}><small>{String(i).padStart(2,'0')} {prop.level?`· ${prop.level===4?'Hotel':'Poziom '+prop.level}`:''}</small><b>{b.name}</b><span>{b.price?`${b.price} zł`:b.desc}</span><em>{owner?owner.name:'Bank'}</em><div>{state.players.filter(p=>!p.bankrupt&&p.position===i).map(p=><span className="flat-pawn" key={p.id} style={{background:COLORS[p.id]}} title={p.name}/>)}</div></button>;})}</div>}
  {!flat&&ready&&<>
   <div className="board-wordmark" aria-hidden="true"><small>KONSTANCIN</small><strong>BUSINESS CLUB</strong><span>{preview?'GOTOWI NA WIELKIE INTERESY?':`RUNDA ${state.round}`}</span></div>
   <div className="board-labels" aria-label="Pola planszy">{labels.map((point,i)=>{const b=BOARD[i],prop=state.props[i];return <button key={i} className={state.players[state.turn].position===i&&!preview?'active':''} style={{transform:point.transform,'--owner':prop.owner===null?'#8094a5':COLORS[prop.owner]}} onClick={()=>choose(i)} onPointerEnter={()=>setHover(i)} onPointerLeave={()=>setHover(-1)} aria-label={`${i}. ${b.name}${b.price?`, ${b.price} zł`:''}`}><b>{b.name}</b>{b.price&&<small>{b.price} zł</small>}</button>;})}</div>
  </>}
  <button className="fallback-switch" onClick={()=>{setFlat(!flat);setReady(false);setFailure('');onMotion(false);}} title={flat?'Włącz 3D':'Włącz 2D'}><Layers size={14}/>{flat?'3D':'2D'}</button>
  {!flat&&<div className="world-bottomline"><button className="field-peek" onClick={()=>choose(inspect)} style={{'--peek-color':owner?.color||(tile.group!==undefined?GROUPS[tile.group].color:'#6fb0c8')}}><span className="peek-number">{String(inspect).padStart(2,'0')}</span><span><b>{tile.name}</b><small>{owner?`${owner.name}${property.mortgaged?' · hipoteka':property.level?' · '+(property.level===4?'hotel':'poziom '+property.level):''}`:tile.price?`Do kupienia · ${tile.price} zł`:'Pole specjalne'}</small></span><span className="peek-more">Szczegóły</span></button><span className="camera-hint">Kliknij pole, aby zobaczyć szczegóły</span></div>}
  <details className="field-index"><summary>Wybierz pole z listy</summary><div>{BOARD.map((b,i)=><button key={i} onClick={()=>{choose(i);}}>{i}. {b.name}</button>)}</div></details>
 </div>;
}
