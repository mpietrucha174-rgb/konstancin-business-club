import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {createGameServer,openDatabase} from '../server.mjs';

test('Portable server: two online sessions, permissions, conflicts and restart persistence',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'kbc-test-'));
  let db,server,base;
  const start=async()=>{db=openDatabase(join(dir,'game.sqlite'));server=createGameServer({db});server.listen(0,'127.0.0.1');await once(server,'listening');base=`http://127.0.0.1:${server.address().port}`;};
  const stop=async()=>{server.close();await once(server,'close');db.close();};
  const call=async(path,body,token,origin=base)=>{const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json',Origin:origin}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,...await r.json()};};
  try{
    await start();
    const home=await fetch(base+'/?room=ABCDEF');assert.equal(home.status,200);assert.match(await home.text(),/Konstancin Business Club/);
    for(const path of ['/town.png','/pawns-3d.png']){const r=await fetch(base+path);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/png');assert.ok((await r.arrayBuffer()).byteLength>10000);}
    assert.equal((await fetch(base+'/server.mjs')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fserver.mjs')).status,403);
    assert.equal((await call('/api/rooms',{name:'Bad Origin'},null,'https://other.example')).status,403);
    const oversized=await fetch(base+'/api/rooms',{method:'POST',body:'x'.repeat(13000)});assert.equal(oversized.status,413);
    const host=await call('/api/rooms',{name:'Host',config:{count:2,maxRounds:20}});assert.equal(host.status,200);
    const path='/api/rooms/'+host.code;
    const guest=await call(path,{op:'join',name:'Guest'});assert.equal(guest.status,200);assert.equal(guest.you,1);
    assert.equal((await call(path)).status,401);
    assert.equal((await call(path,null,'wrong')).status,401);
    const started=await call(path,{op:'start',revision:guest.revision},host.token);assert.equal(started.status,200);
    assert.equal(started.state.props.length,40);assert.equal(started.state.players[1].name,'Guest');
    assert.equal((await call(path,{op:'action',action:{action:'roll'},revision:started.revision},guest.token)).status,403);
    const results=await Promise.all([call(path,{op:'action',action:{action:'roll'},revision:started.revision},host.token),call(path,{op:'action',action:{action:'roll'},revision:started.revision},host.token)]);
    assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
    const moved=results.find(r=>r.status===200);
    const read=await call(path,null,guest.token);assert.deepEqual(read.state,moved.state);assert.equal(read.state.seed,undefined);assert.equal(read.state.decks,undefined);assert.ok(read.members.every(m=>!('tokenHash' in m)));
    await stop();await start();
    const restored=await call(path,null,host.token);assert.equal(restored.status,200);assert.deepEqual(restored.state,moved.state);assert.equal(restored.revision,moved.revision);
    await stop();server=null;
  }finally{if(server?.listening)await stop();rmSync(dir,{recursive:true,force:true});}
});

test('Configured HTTPS origin works behind a proxy and rejects foreign origins',async()=>{
  const db=openDatabase(':memory:');
  const server=createGameServer({db,publicOrigin:'https://gra.example'});
  server.listen(0,'127.0.0.1');await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const [origin,status] of [['https://gra.example',200],['https://foreign.example',403]]){
      const response=await fetch(base+'/api/rooms',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({name:'Proxy test'})});
      assert.equal(response.status,status);await response.text();
    }
  }finally{server.close();await once(server,'close');db.close();}
});
