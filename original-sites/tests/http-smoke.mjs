import assert from 'node:assert/strict';
const base=process.env.GAME_TEST_ORIGIN||'http://127.0.0.1:4173';
async function call(path,body,token){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json',Origin:base}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();return {status:r.status,...data};}
const html=await (await fetch(base)).text();assert.ok(html.includes('Chata prezesa'));assert.ok(html.includes('Gramy!'));
const art=await fetch(base+'/town.png');assert.equal(art.status,200);assert.ok(art.headers.get('content-type').includes('image'));
const host=await call('/api/rooms',{name:'Smoke Host',config:{count:2,maxRounds:20}});assert.equal(host.status,200);
const path='/api/rooms/'+host.code;
const guest=await call(path,{op:'join',name:'Smoke Guest'});assert.equal(guest.status,200);assert.equal(guest.you,1);
const unauth=await call(path,null,'incorrect');assert.equal(unauth.status,401);
const started=await call(path,{op:'start',revision:guest.revision},host.token);assert.equal(started.status,200);assert.equal(started.state.players[1].name,'Smoke Guest');
const denied=await call(path,{op:'action',action:{action:'roll'},revision:started.revision},guest.token);assert.equal(denied.status,403);
const rolled=await call(path,{op:'action',action:{action:'roll'},revision:started.revision},host.token);assert.equal(rolled.status,200);
const [duplicateA,duplicateB]=await Promise.all([call(path,{op:'action',action:{action:'roll'},revision:started.revision},host.token),call(path,{op:'action',action:{action:'roll'},revision:started.revision},host.token)]);assert.equal(duplicateA.status,409);assert.equal(duplicateB.status,409);
const read=await call(path,null,guest.token);assert.deepEqual(read.state,rolled.state);assert.equal(read.state.seed,undefined);assert.ok(read.members.every(m=>m.tokenHash===undefined));
console.log(JSON.stringify({httpIntegration:'passed',page:'200',asset:'200',onlineRoom:'created and joined',move:'same on both sessions',authorization:'enforced',staleWrites:'rejected'}));
