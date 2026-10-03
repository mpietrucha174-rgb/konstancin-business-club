import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync,statSync,existsSync} from 'node:fs';
import {resolve,join,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {roomRequest} from './game/rooms.mjs';

const root=fileURLToPath(new URL('.',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.woff2':'font/woff2'};
function error(message,status){return Object.assign(new Error(message),{status});}

// Same prepared-query interface used by the original Cloudflare D1 backend.
export function openDatabase(filename){
  const sqlite=new DatabaseSync(filename);
  sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS rooms (code TEXT PRIMARY KEY NOT NULL,data TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0,updated INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS heartbeats (room TEXT NOT NULL,seat INTEGER NOT NULL,seen INTEGER NOT NULL,PRIMARY KEY(room,seat));');
  return {
    close:()=>sqlite.close(),
    prepare(sql){const statement=sqlite.prepare(sql);let values=[];return {
      bind(...args){values=args;return this;},
      async first(){return statement.get(...values)||null;},
      async all(){return {results:statement.all(...values)};},
      async run(){const result=statement.run(...values);return {meta:{changes:Number(result.changes)}};}
    };}
  };
}

export function createGameServer({db,dist=join(root,'dist'),publicOrigin}={}){
  if(!db)throw new Error('Missing database.');
  const canonical=publicOrigin?new URL(publicOrigin).origin:null;
  const assets=resolve(dist);
  const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  const server=createServer(async(req,res)=>{
    try{
      const origin=canonical||`http://${req.headers.host||'localhost'}`;
      const url=new URL(req.url,origin);
      // API URLs always use our configured origin, never a supplied absolute URL.
      const pathname=url.pathname;
      if(pathname==='/health'){send(res,200,{ok:true});return;}
      if(pathname==='/api/rooms'||/^\/api\/rooms\/[^/]+$/.test(pathname)){
        if(!['GET','POST'].includes(req.method))throw error('Niedozwolona metoda.',405);
        let size=0;const chunks=[];
        for await(const chunk of req){size+=chunk.length;if(size>12000){send(res,413,{error:'Żądanie jest za duże.'});return;}chunks.push(chunk);}
        const headers=new Headers();
        for(const name of ['origin','authorization','content-type'])if(req.headers[name])headers.set(name,req.headers[name]);
        const request=new Request(new URL(pathname+url.search,origin),{method:req.method,headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
        const code=pathname==='/api/rooms'?null:pathname.split('/')[3];
        const data=await roomRequest(db,request,code);
        send(res,200,data);return;
      }
      if(pathname.startsWith('/api/')){send(res,404,{error:'Nie ma takiej operacji.'});return;}
      if(!['GET','HEAD'].includes(req.method))throw error('Niedozwolona metoda.',405);
      let decoded;try{decoded=decodeURIComponent(pathname);}catch{throw error('Nieprawidłowy adres.',400);}
      let file=resolve(assets,'.'+decoded);
      if(file!==assets&&!file.startsWith(assets+sep))throw error('Brak dostępu.',403);
      if(pathname==='/')file=join(assets,'index.html');
      if(!existsSync(file)||!statSync(file).isFile())throw error('Nie ma takiego pliku.',404);
      const content=readFileSync(file);
      res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':content.length,'Cache-Control':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'});
      res.end(req.method==='HEAD'?undefined:content);
    }catch(e){if(!e.status)console.error(e);if(!res.headersSent)send(res,e.status||503,{error:e.status?e.message:'Serwer gry jest chwilowo niedostępny. Spróbuj ponownie.'});else res.end();}
  });
  server.requestTimeout=15000;
  server.headersTimeout=10000;
  return server;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(!existsSync(join(root,'dist/index.html')))throw new Error('Brak plików gry. Uruchom npm ci oraz npm run build.');
  const dataDir=resolve(process.env.DATA_DIR||join(root,'data'));mkdirSync(dataDir,{recursive:true});
  const db=openDatabase(join(dataDir,'konstancin.sqlite'));
  const port=Number(process.env.PORT||3000),host=process.env.HOST||'0.0.0.0';
  const server=createGameServer({db,publicOrigin:process.env.PUBLIC_ORIGIN});
  server.listen(port,host,()=>console.log(`Konstancin Business Club: http://localhost:${port}\nW sieci lokalnej: http://ADRES-IP-TEGO-KOMPUTERA:${port}\nBaza rozgrywek: ${dataDir}`));
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{db.close();process.exit(0);}));
}
