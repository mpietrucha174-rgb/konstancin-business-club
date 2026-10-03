export const COLORS = ['#ed3d43','#2687f4','#f6c632','#28b666'];
export const ICONS = ['🔴','🔵','🟡','🟢'];
export const GROUPS = [
  {name:'Piasta i CKR',color:'#cf935a'}, {name:'Po sąsiedzku',color:'#56c2e2'},
  {name:'Spokojne przedmieścia',color:'#c38fdf'}, {name:'Północny Konstancin',color:'#ee975b'},
  {name:'Nad Jeziorką',color:'#ec728c'}, {name:'Kultura i zakupy',color:'#edc64c'},
  {name:'Nadwiślański klimat',color:'#66c8a0'}, {name:'Uzdrowiskowy prestiż',color:'#658fee'}
];
const p=(name,group,price,rent,desc)=>({type:'property',name,group,price,rent,build:Math.round(price*.45/10)*10,desc});
const station=(name,desc)=>({type:'station',name,price:200,desc});
const event={type:'event',name:'Szansa',deck:'chance',desc:'Dobierz kartę Szansy i wykonaj jej polecenie.'};
const chest={type:'event',name:'Kasa gminna',deck:'chest',desc:'Dobierz kartę Kasy gminnej. Wpłaty, wypłaty i sąsiedzkie rozliczenia.'};
export const BOARD=[
 {type:'start',name:'ZS2',desc:'Każde przejście przez ZS2 to 200 zł. Biznes się kręci.'},
 p('Piasta',0,100,12,'Tu wszystko się zaczyna. Mały lokal, wielkie plany.'),
 p('CKR',0,120,14,'Spokojna okolica. Twój portfel też jeszcze jest spokojny.'),
 {...chest},{...event},station('Stocer','Na trasie Twoich lokalnych interesów.'),
 p('Doły',1,140,18,'Sosny, spokój i całkiem niezły zwrot z inwestycji.'),
 p('Chylice',1,160,20,'Niby po sąsiedzku, a już własny mały rynek.'),
 p('Zalesie Górne',1,180,22,'Jeszcze jedna miejscówka na Twojej trasie.'),
 {type:'tax',name:'Palenie w łazience',amount:100,desc:'Palenie w łazience: opłata na tym polu wynosi 100 zł.'},
 {type:'jail',name:'Pani Alcan',desc:'Odwiedziny u Pani Alcan — albo postój, jeśli skierowała cię tu straż.'},
 p('Skolimów',2,180,24,'Wille, drzewa i sąsiedzi z dobrym gustem.'),
 p('Szymanów',2,200,26,'Mały adres. Duża szansa.'),
 p('Kierszek',2,220,28,'Zielony przystanek na drodze do własnego imperium.'),
 {type:'utility',name:'CBD ze Skolimowa',price:150,desc:'Lokalny punkt na biznesowej trasie. Czynsz zależy od rzutu kostkami.'},
 {...chest},p('Bielawa',3,220,30,'Północny przyczółek twojego imperium.'),
 p('Klarysew',3,240,32,'Dobra lokalizacja lubi dobre inwestycje.'),
 p('Okrzeszyn',3,260,34,'Nowy kawałek planszy, nowe możliwości.'),
 station('Linia 742','Następny przystanek: niezależność finansowa.'),
 {type:'parking',name:'Wiadro',desc:'Zatrzymujesz się na jedną kolejkę. Pomijasz swoją następną turę, potem wracasz do gry.'},
 p('Mirków',4,260,36,'Przemysłowy charakter, przedsiębiorczy duch.'),
 p('Grapa',4,280,38,'Blisko rzeki, blisko biznesu.'),
 p('Habdzin',4,300,40,'Sąsiedzi już pytają o Twoje ceny.'),
 {...event},p('Stara Papiernia',5,300,42,'Historia dostała nowe życie. I nowy cennik.'),
 p('Borowina',5,320,44,'Trochę kultury, trochę prestiżu, sporo potencjału.'),
 p('Słomczyn',5,340,46,'Kolejna miejscówka do Twojej kolekcji.'),
 {type:'utility',name:'Energetyka',price:150,desc:'Twój biznes potrzebuje prądu. Inni za niego płacą.'},
 {type:'tax',name:'Kradzież kaucji',amount:150,desc:'Kradzież kaucji: na tym polu tracisz 150 zł.'},
 {type:'police',name:'Straż miejska',desc:'Jedziesz do Pani Alcan, bez premii za ZS2.'},
 p('Obory',6,340,48,'Dworski klimat. Królewskie ambicje.'),
 {...event},
 p('Osiedle Elsam',6,360,50,'Nadwiślańskie okolice mają swój urok.'),
 station('Linia 710','Autobus przyjedzie. A czynsz już jest.'),
 {...chest},station('Linia nocna','Ostatni kurs, pierwszy pomysł na kolejny interes.'),p('Ławka palacza',7,400,56,'Adres, który robi wrażenie jeszcze przed wizytą.'),
 p('Narnia',7,420,60,'Willowy Konstancin. Tutaj nie ma tanich spacerów.'),
 p('Chata prezesa',7,460,64,'Najbardziej prestiżowe pole. Chata prezesa, czynsz dla ciebie.')
];
export const LEGACY_BOARD_MAP=[0,1,2,4,5,6,7,9,10,11,12,14,15,16,17,19,20,21,22,24,25,26,28,29,30,31,33,34,35,37,38,39];
export const FIELD={start:0,jail:BOARD.findIndex(b=>b.type==='jail'),stocer:BOARD.findIndex(b=>b.name==='Stocer'),skolimow:BOARD.findIndex(b=>b.name==='Skolimów'),president:BOARD.findIndex(b=>b.name==='Chata prezesa')};
export const EVENTS=[
 {cardId:0,title:'Korek na Wilanowskiej',text:'Stoisz w korku na Wilanowskiej. Nawigacja obiecała 12 minut, a na paliwo poszło 60 zł.',money:-60},
 {cardId:1,title:'Kradzież z puszki WOŚP',text:'Kradzież z puszki WOŚP. Otrzymujesz 120 zł.',money:120},
 {cardId:2,title:'Dajesz szluga Omenowi',text:'Dajesz szluga Omenowi. Koszt tej przysługi: 90 zł.',money:-90},
 {cardId:3,title:'Sąsiad polecił twój lokal',text:'Poczta pantoflowa działa lepiej niż reklama. Otrzymujesz 100 zł.',money:100},
 {cardId:4,title:'Doładowanie karty miejskiej',text:'Doładowujesz kartę miejską. Płacisz 80 zł.',money:-80},
 {cardId:5,title:'Biletowana impreza u prezesa',text:'Organizujesz biletowaną imprezę u prezesa. Zysk z biletów: 150 zł.',money:150},
 {cardId:6,title:'Starzy wracają z wakacji',text:'Starzy wracają z wakacji. Zapłać Ukraince za posprzątanie mieszkania: 35 zł za każdy poziom rozbudowy, czyli 140 zł za hotel.',repair:35},
 {cardId:7,title:'Kaczkomat z Omenem i Ząbkiem',text:'Okradasz Kaczkomat wraz z Omenem i Ząbkiem. Twój udział: 50 zł.',money:50},
 {cardId:8,title:'Roman Rudowski w toalecie',text:'Roman Rudowski wparował do toalety męskiej i przyłapał Was na paleniu. Zapłać 250 zł albo trafiasz do Pani Alcan.',fineOrJail:250},
 {cardId:9,title:'Komplet papierów',text:'Zachowaj kartę: jednorazowo wyjdziesz z kontroli bez opłaty.',free:true},
 {cardId:10,title:'Dotacja na dobry pomysł',text:'Papierologia się opłaciła. Otrzymujesz 200 zł.',money:200},
 {cardId:11,title:'Nowy kwartał',text:'Wracasz na ZS2 i otrzymujesz 200 zł. Nowa szansa, ten sam apetyt.',start:true},
 {cardId:12,title:'Zaproszenie do Skolimowa',text:'Przejedź na Skolimów. Jeśli miniesz ZS2, dostaniesz premię.',move:FIELD.skolimow},
 {cardId:13,title:'Dożynki',text:'Dożynki. Płacisz 100 zł za wybite zęby.',money:-100},
 {cardId:14,title:'Cztery Perły Export i brak toalety',text:'Po wypiciu 4 Pereł Export strasznie chce Ci się siku, jednak nie ma w Twojej okolicy toalety. Sikasz w krzaki i dostajesz mandat 100 zł.',money:-100},
 {cardId:15,title:'Sprzedajesz towar Omena',text:'Sprzedajesz kradziony przez Omena towar. Otrzymujesz 80 zł.',money:80},
 {cardId:16,title:'Pietrucha nie zdał',text:'Jesteś Pietrucha i nie zdałeś do następnej klasy. Wracasz na pole ZS2 i zaczynasz wszystko od nowa — bez pieniędzy za przejście. Zachowujesz gotówkę i nieruchomości.',returnStart:true,deck:'chance'},
 {cardId:17,title:'Cofnij się o trzy pola',text:'Cofnij pionek o trzy pola i wykonaj polecenie pola, na którym się zatrzymasz. Bez premii za ZS2.',back:3,deck:'chance'},
 {cardId:18,title:'Najbliższa linia',text:'Jedź do najbliższego pola transportu przed Tobą. Cudzy transport kosztuje podwójny czynsz. Wolne pole możesz kupić lub licytować. Za minięcie ZS2 otrzymujesz 200 zł.',nearest:'station',rentMultiplier:2,deck:'chance'},
 {cardId:19,title:'Najbliższe media',text:'Idź do najbliższego pola mediów przed Tobą. Jeśli ma innego właściciela, rzuć ponownie kostkami i zapłać 10 razy ich sumę. Wolne pole możesz kupić lub licytować. Za minięcie ZS2 otrzymujesz 200 zł.',nearest:'utility',utilityMultiplier:10,deck:'chance'},
 {cardId:20,title:'Wizyta u prezesa',text:'Przejdź na pole Chata prezesa. Rozlicz pole jak zwykle. Jeśli miniesz ZS2, otrzymujesz 200 zł.',move:FIELD.president,deck:'chance'},
 {cardId:21,title:'Wycieczka do Stocera',text:'Jedź na Stocer. Rozlicz pole jak zwykle. Jeśli miniesz ZS2, otrzymujesz 200 zł.',move:FIELD.stocer,deck:'chance'},
 {cardId:22,title:'Idziesz do Pani Alcan',text:'Przejdź prosto do Pani Alcan. Nie otrzymujesz 200 zł za ZS2 i nie wykonujesz dodatkowego rzutu za dublet.',jail:true,deck:'chance'},
 {cardId:23,title:'Remont wszystkich budynków',text:'Zapłać bankowi 25 zł za każdy poziom rozbudowy 1–3 oraz 100 zł za każdy hotel. Sam hotel nie jest liczony dodatkowo jako trzy poziomy.',repairs:{house:25,hotel:100},deck:'chance'},
 {cardId:24,title:'Krystian oddaje pożyczkę',text:'Krystian niespodziewanie oddaje Ci pieniądze pożyczone 5 lat temu. Otrzymujesz 200 zł.',money:200,deck:'chest'},
 {cardId:25,title:'Urodziny',text:'Masz urodziny. Każdy pozostały gracz, który nadal uczestniczy w grze, płaci Ci 20 zł.',collectEach:20,deck:'chest'},
 {cardId:26,title:'Zbita na zioło',text:'Zbita na zioło. Zapłać każdemu pozostałemu graczowi, który nadal uczestniczy w grze, po 50 zł.',payEach:50,deck:'chest'},
 {cardId:28,title:'Paradowski zbił lufkę',text:'Paradowski zbił lufkę, musisz kupić nową. Płacisz 100 zł.',money:-100,deck:'chest'},
 {cardId:29,title:'Zwrot nadpłaty',text:'Rozliczenie wyszło na Twoją korzyść. Bank wypłaca Ci 20 zł.',money:20,deck:'chest'},
 {cardId:31,title:'Wyjście od Pani Alcan',text:'Zachowaj tę kartę. Możesz użyć jej raz, aby wyjść od Pani Alcan bez opłaty. Po użyciu karta wraca do talii.',free:true,deck:'chest'},
 {cardId:32,title:'Ząbek z maczetą',text:'Goni Cię Ząbek z maczetą i wpadasz w rów. Teleportuj się na pole Stocer i zapłać 75 zł za gips. Bez premii za ZS2 i bez rozliczania pola Stocer.',teleport:FIELD.stocer,money:-75,deck:'chest'}
].map((e,i)=>({...e,deck:e.deck||([0,2,5,6,8,9,12,14].includes(i)?'chance':'chest')}));
const copy=x=>structuredClone(x);
export function upgradeGame(input){
 const s=copy(input);
 if(s.props.length===LEGACY_BOARD_MAP.length){
  const props=BOARD.map(()=>({owner:null,level:0,mortgaged:false}));s.props.forEach((v,i)=>{props[LEGACY_BOARD_MAP[i]]=v;});s.props=props;
  for(const p of s.players){const from=LEGACY_BOARD_MAP[p.position];if(s.debt?.id===p.id&&s.debt.afterMove){const to=LEGACY_BOARD_MAP[(p.position+s.debt.afterMove)%LEGACY_BOARD_MAP.length];s.debt.afterMove=(to-from+BOARD.length)%BOARD.length;}p.position=from;}
  if(s.auction)s.auction.i=LEGACY_BOARD_MAP[s.auction.i];
  if(s.event){if(s.event.move!==undefined)s.event.move=LEGACY_BOARD_MAP[s.event.move];if(s.event.teleport!==undefined)s.event.teleport=LEGACY_BOARD_MAP[s.event.teleport];}
  s.lastMove=null;
 }
 for(const p of s.players){p.color=COLORS[p.id];p.icon=ICONS[p.id];}s.boardRevision=2;migrateEvents(s);return s;
}
function migrateEvents(s){
 if(s.eventsRevision===2)return;
 const remap=i=>EVENTS.findIndex(e=>e.cardId===i);
 for(const p of s.players){if(p.freeCardSources)p.freeCardSources=p.freeCardSources.map(remap).filter(i=>i>=0&&EVENTS[i].free);}
 for(const deck of Object.keys(s.decks||{}))s.decks[deck]=s.decks[deck].map(remap).filter(i=>i>=0&&EVENTS[i].deck===deck);
 if(s.status==='event'&&s.event){const index=Number.isInteger(s.event.cardIndex)?remap(s.event.cardIndex):-1;const card=index>=0?EVENTS[index]:EVENTS.find(e=>e.title===s.event.title);if(card)s.event={...card,...(index>=0?{cardIndex:index}:{})};else if(['Wizyta u lekarza','Niespodziewany spadek'].includes(s.event.title)){s.event={title:'Wycofana karta',text:'Ta karta została usunięta z rozgrywki. Bez opłaty ani nagrody.',deck:s.event.deck};}else{const replacements={'Błąd banku na Twoją korzyść':24,'Przewodniczący sąsiedzkiego klubu':26,'Czesne':28,'Wycieczka na Polną':21};const replacement=EVENTS.find(e=>e.cardId===replacements[s.event.title]);if(replacement)s.event={...replacement};}}
 s.eventsRevision=2;
}
function rand(s,max){let n=s.seed|0;n^=n<<13;n^=n>>>17;n^=n<<5;s.seed=n>>>0;return s.seed%max;}
export const active=s=>s.players[s.status==='debt'?s.debt.id:s.turn];
export const owned=(s,id)=>s.props.map((v,i)=>({...v,i})).filter(v=>v.owner===id);
export function completeGroup(s,id,g){return BOARD.every((b,i)=>b.group!==g||s.props[i].owner===id);}
export function worth(s,id){return s.players[id].cash+owned(s,id).reduce((sum,v)=>sum+(v.mortgaged?Math.floor(BOARD[v.i].price/2):BOARD[v.i].price)+v.level*BOARD[v.i].build,0);}
export function rent(s,i,dice=7){const b=BOARD[i],v=s.props[i];if(v.owner===null||v.mortgaged)return 0;
 if(b.type==='station')return 25*2**(owned(s,v.owner).filter(x=>BOARD[x.i].type==='station').length-1);
 if(b.type==='utility')return dice*(owned(s,v.owner).filter(x=>BOARD[x.i].type==='utility').length===2?10:4);
 return b.rent*(v.level?[1,3,7,13,21][v.level]:completeGroup(s,v.owner,b.group)?2:1);
}
export function log(s,message){s.log.unshift({message,round:s.round});s.log=s.log.slice(0,70);}
export function newGame(config={}){const count=Math.max(2,Math.min(4,config.count||4));const s={version:1,eventsRevision:2,boardRevision:2,seed:config.seed||Math.floor(Math.random()*0xffffffff)||1,players:[],props:BOARD.map(()=>({owner:null,level:0,mortgaged:false})),turn:0,round:1,maxRounds:config.maxRounds??30,difficulty:config.difficulty||'normal',status:'roll',dice:[1,1],doubles:0,lastMove:null,event:null,auction:null,debt:null,log:[],winner:null,finishReason:null};
 for(let i=0;i<count;i++){const c=config.players?.[i]||{};s.players.push({id:i,name:(c.name||['Ty','Willa Wanda','Pan Deweloper','Król Gołkowa'][i]).slice(0,22),bot:c.bot??i!==0,color:COLORS[i],icon:ICONS[i],cash:1500,position:0,jail:0,skipTurns:0,freeCards:0,bankrupt:false});}
 log(s,'Nowa rozgrywka. Każdy zaczyna z 1 500 zł. Powodzenia, przyszli magnaci!');return s;
}
function requireStatus(s,...statuses){if(!statuses.includes(s.status))throw new Error('Ta akcja nie jest teraz dostępna.');if(active(s).bankrupt)throw new Error('Ten gracz zakończył grę.');}
function checkWinner(s){const alive=s.players.filter(p=>!p.bankrupt);if(alive.length<=1){s.status='finished';s.winner=alive[0]?.id??null;s.finishReason='bankruptcy';s.auction=null;s.debt=null;}}
function charge(s,id,amount,creditor=null,resume='end'){s.players[id].cash-=amount;if(creditor!==null)s.players[creditor].cash+=amount;if(s.players[id].cash<0){s.debt={id,creditor,resume};s.status='debt';}else s.status=resume;}
function processPayments(s){if(!s.payments)return;while(s.payments.length){const {from,to,amount}=s.payments.shift();if(s.players[from].bankrupt||s.players[to].bankrupt)continue;charge(s,from,amount,to);log(s,`${s.players[from].name} płaci ${amount} zł → ${s.players[to].name}.`);if(s.status==='debt')return;}s.payments=null;s.status='end';}
function settle(s){if(s.status==='debt'&&s.players[s.debt.id].cash>=0){s.status=s.debt.resume;s.debt=null;log(s,'Zadłużenie spłacone. Można wracać do interesów.');processPayments(s);}}
function drawEvent(s,deck){s.decks??={};if(!s.decks[deck]?.length){const held=new Set(s.players.flatMap(p=>p.freeCardSources||[]));const cards=EVENTS.map((e,i)=>({e,i})).filter(({e,i})=>e.deck===deck&&!held.has(i)).map(({i})=>i);for(let i=cards.length-1;i>0;i--){const j=rand(s,i+1);[cards[i],cards[j]]=[cards[j],cards[i]];}s.decks[deck]=cards;}const cardIndex=s.decks[deck].shift();s.event={...EVENTS[cardIndex],cardIndex};s.status='event';}
function move(s,target,steps,bonus=true){const p=active(s);const from=p.position;if(bonus&&steps>0&&from+steps>=BOARD.length){p.cash+=200;log(s,`${p.name} mija ZS2: +200 zł.`);}p.position=target;s.lastMove={id:p.id,from,to:target,steps};}
function jail(s){const p=active(s);move(s,FIELD.jail,0,false);p.jail=3;s.doubles=0;s.status='end';log(s,`${p.name} trafia do Pani Alcan. Postój na polu ${FIELD.jail}.`);}
function landing(s,e={}){const p=active(s),i=p.position,b=BOARD[i],v=s.props[i];s.status='end';
 if(b.price){if(v.owner===null){s.status='purchase';return;}if(v.owner!==p.id&&!v.mortgaged&&!s.players[v.owner].jail){if(e.utilityMultiplier){s.dice=[rand(s,6)+1,rand(s,6)+1];log(s,`Rzut do opłaty za media: ${s.dice[0]} + ${s.dice[1]}. Ten rzut nie daje dodatkowej tury.`);}const r=e.utilityMultiplier?(s.dice[0]+s.dice[1])*e.utilityMultiplier:rent(s,i,s.dice[0]+s.dice[1])*(e.rentMultiplier||1);charge(s,p.id,r,v.owner);log(s,`${p.name} płaci ${r} zł za ${b.name} → ${s.players[v.owner].name}.`);}else log(s,v.owner===p.id?`${b.name}: w swoim biznesie jak w domu.`:v.mortgaged?`${b.name} jest obciążone hipoteką. Bez czynszu.`:'Właściciel jest u Pani Alcan. Bez czynszu.');}
 else if(b.type==='tax'){charge(s,p.id,b.amount);log(s,`${p.name}: ${b.name.toLowerCase()}, −${b.amount} zł.`);}
 else if(b.type==='police')jail(s);
 else if(b.type==='event')drawEvent(s,b.deck||'chance');
 else if(b.type==='parking'){p.skipTurns=1;s.doubles=0;log(s,`${p.name}: Wiadro. Następna tura zostaje pominięta.`);}
 else log(s,b.type==='jail'?'Tylko odwiedziny u Pani Alcan. Możesz jechać dalej.':'ZS2. Dobry początek kolejnego okrążenia.');
}
export function roll(s){requireStatus(s,'roll');s.lastMove=null;s.event=null;const p=active(s);s.dice=[rand(s,6)+1,rand(s,6)+1];const dbl=s.dice[0]===s.dice[1],steps=s.dice[0]+s.dice[1];log(s,`${p.name} rzuca ${s.dice[0]} + ${s.dice[1]}.`);
 if(p.jail){if(dbl){p.jail=0;s.doubles=0;log(s,'Dublet! Opuszczasz pole Pani Alcan.');}else{p.jail--;s.doubles=0;if(p.jail){s.status='end';log(s,`Postój u Pani Alcan. Pozostało prób: ${p.jail}.`);return s;}charge(s,p.id,50,null,'end');log(s,'Trzecia próba: opłata 50 zł i wyjazd.');if(s.status==='debt'){s.debt.afterMove=steps;return s;}}}
 else{s.doubles=dbl?s.doubles+1:0;if(s.doubles===3){jail(s);return s;}}
 move(s,(p.position+steps)%BOARD.length,steps);landing(s);return s;
}
function returnFreeCards(s,p,all=false){const cards=all?(p.freeCardSources||[]).splice(0):(p.freeCardSources||[]).splice(0,1);for(const i of cards){const deck=EVENTS[i].deck;s.decks??={};if(s.decks[deck]&&!s.decks[deck].includes(i))s.decks[deck].push(i);}}
export function payJail(s,useCard=false){requireStatus(s,'roll');const p=active(s);if(!p.jail)throw new Error('Nie jesteś u Pani Alcan.');if(useCard){if(!p.freeCards)throw new Error('Brak karty.');p.freeCards--;returnFreeCards(s,p);}else{if(p.cash<50)throw new Error('Potrzebujesz 50 zł.');p.cash-=50;}p.jail=0;log(s,`${p.name} opuszcza pole Pani Alcan ${useCard?'dzięki karcie':'za 50 zł'}.`);return s;}
export function buy(s){requireStatus(s,'purchase');const p=active(s),i=p.position,b=BOARD[i];if(p.cash<b.price)throw new Error('Za mało gotówki. Możesz wziąć udział w licytacji.');p.cash-=b.price;s.props[i].owner=p.id;s.status='end';log(s,`${p.name} kupuje ${b.name} za ${b.price} zł.`);return s;}
export function startAuction(s){requireStatus(s,'purchase');s.auction={i:active(s).position,bid:0,leader:null,passed:[],current:s.turn};s.status='auction';log(s,`Licytacja: ${BOARD[s.auction.i].name}. Cena wywoławcza: 20 zł.`);return s;}
function advanceAuction(s){const a=s.auction;const left=s.players.filter(p=>!p.bankrupt&&!a.passed.includes(p.id));if(!left.length||(left.length===1&&a.leader===left[0].id)){if(a.leader!==null){s.players[a.leader].cash-=a.bid;s.props[a.i].owner=a.leader;log(s,`${s.players[a.leader].name} wygrywa licytację: ${BOARD[a.i].name}, ${a.bid} zł.`);}else log(s,'Brak ofert. Nieruchomość zostaje w banku.');s.auction=null;s.status='end';return;}
 for(let step=1;step<=s.players.length;step++){const n=(a.current+step)%s.players.length;if(!s.players[n].bankrupt&&!a.passed.includes(n)&&n!==a.leader){a.current=n;return;}}
}
export function bid(s,amount){requireStatus(s,'auction');const a=s.auction,p=s.players[a.current];if(!Number.isInteger(amount)||amount<a.bid+20||amount>p.cash)throw new Error('Oferta musi być o minimum 20 zł wyższa i mieścić się w budżecie.');a.bid=amount;a.leader=p.id;log(s,`${p.name} licytuje ${amount} zł.`);advanceAuction(s);return s;}
export function passAuction(s){requireStatus(s,'auction');s.auction.passed.push(s.auction.current);advanceAuction(s);return s;}
export function resolveEvent(s,choice){
 requireStatus(s,'event');const e=s.event,p=active(s);
 if(e.fineOrJail){if(!['pay','jail'].includes(choice))throw new Error('Wybierz: zapłata mandatu albo Pani Alcan.');if(choice==='pay'&&p.cash<e.fineOrJail)throw new Error(`Potrzebujesz ${e.fineOrJail} zł na zapłatę mandatu.`);}
 s.status='end';log(s,`${e.title}: ${e.text}`);
 if(e.money)charge(s,p.id,-e.money);
 if(e.repair){const cost=owned(s,p.id).reduce((sum,v)=>sum+v.level*e.repair,0);charge(s,p.id,cost);log(s,`Koszt sprzątania: ${cost} zł.`);}
 if(e.repairs){const cost=owned(s,p.id).reduce((sum,v)=>sum+(v.level===4?e.repairs.hotel:v.level*e.repairs.house),0);charge(s,p.id,cost);log(s,`Koszt remontu: ${cost} zł.`);}
 if(e.free){p.freeCards++;if(Number.isInteger(e.cardIndex)){p.freeCardSources??=[];p.freeCardSources.push(e.cardIndex);}}
 if(e.payEach||e.collectEach){const others=s.players.filter(x=>x.id!==p.id&&!x.bankrupt).sort((a,b)=>(a.id-p.id+s.players.length)%s.players.length-(b.id-p.id+s.players.length)%s.players.length);s.payments=others.map(x=>({from:e.payEach?p.id:x.id,to:e.payEach?x.id:p.id,amount:e.payEach||e.collectEach}));processPayments(s);}
 if(e.fineOrJail){if(choice==='pay'){charge(s,p.id,e.fineOrJail);log(s,`${p.name} płaci mandat ${e.fineOrJail} zł i gra dalej.`);}else jail(s);}
 if(e.jail)jail(s);
 if(e.start||e.returnStart){move(s,0,BOARD.length-p.position,false);if(e.start)p.cash+=200;}
 if(e.teleport!==undefined)move(s,e.teleport,0,false);
 if(e.back){const target=(p.position-e.back+BOARD.length)%BOARD.length;move(s,target,-e.back,false);landing(s);}
 if(e.move!==undefined||e.nearest){let target=e.move;if(e.nearest){for(let step=1;step<=BOARD.length;step++){const i=(p.position+step)%BOARD.length;if(BOARD[i].type===e.nearest){target=i;break;}}}const steps=(target-p.position+BOARD.length)%BOARD.length;move(s,target,steps);landing(s,e);}
 return s;
}
export function endTurn(s){requireStatus(s,'end','skip');if(s.status==='skip'){const p=active(s);p.skipTurns=Math.max(0,(p.skipTurns||0)-1);log(s,`${p.name} opuszcza jedną turę przez Wiadro. W następnej wraca do gry.`);}else if(s.doubles>0&&!active(s).jail){s.status='roll';log(s,'Dublet daje dodatkowy rzut.');return s;}s.doubles=0;s.event=null;s.lastMove=null;let next=s.turn;do{next=(next+1)%s.players.length;if(next===0)s.round++;}while(s.players[next].bankrupt);s.turn=next;
 if(s.maxRounds&&s.round>s.maxRounds){s.status='finished';const ranking=s.players.filter(p=>!p.bankrupt).sort((a,b)=>worth(s,b.id)-worth(s,a.id));const best=worth(s,ranking[0].id);const ties=ranking.filter(p=>worth(s,p.id)===best);s.winner=ties.length===1?ranking[0].id:null;s.finishReason=ties.length===1?'rounds':'tie';s.round=s.maxRounds;log(s,'Koniec limitu rund. Wygrywa największa wartość majątku.');}else s.status=active(s).skipTurns>0?'skip':'roll';return s;}
export function canBuild(s,id,i){const b=BOARD[i],v=s.props[i];if(!b||b.type!=='property'||v.owner!==id||v.level>=4||v.mortgaged||!completeGroup(s,id,b.group))return false;const group=owned(s,id).filter(x=>BOARD[x.i].group===b.group);return !group.some(x=>x.mortgaged)&&v.level===Math.min(...group.map(x=>x.level))&&s.players[id].cash>=b.build;}
export function propertyAction(s,i,action){requireStatus(s,'roll','purchase','end','debt');const p=active(s),v=s.props[i],b=BOARD[i];if(!v||v.owner!==p.id)throw new Error('To nie jest twoja nieruchomość.');
 if(action==='build'){if(s.status==='debt'||!canBuild(s,p.id,i))throw new Error('Potrzebujesz całej dzielnicy, gotówki i równomiernej rozbudowy.');p.cash-=b.build;v.level++;log(s,`${p.name} rozbudowuje ${b.name} (poziom ${v.level}).`);}
 else if(action==='sell'){if(!v.level)throw new Error('Brak budynków.');const max=Math.max(...owned(s,p.id).filter(x=>BOARD[x.i].group===b.group).map(x=>x.level));if(v.level!==max)throw new Error('Sprzedawaj budynki równomiernie — zacznij od najwyższego poziomu.');v.level--;p.cash+=Math.floor(b.build/2);log(s,`Sprzedaż rozbudowy: ${b.name}, +${Math.floor(b.build/2)} zł.`);}
 else if(action==='mortgage'){if(v.mortgaged||v.level||b.group!==undefined&&owned(s,p.id).some(x=>BOARD[x.i].group===b.group&&x.level))throw new Error('Najpierw sprzedaj rozbudowę całej dzielnicy.');v.mortgaged=true;p.cash+=Math.floor(b.price/2);log(s,`Hipoteka: ${b.name}, +${Math.floor(b.price/2)} zł.`);}
 else if(action==='redeem'){const cost=Math.ceil(b.price*.55);if(!v.mortgaged||p.cash<cost||s.status==='debt')throw new Error('Za mało gotówki lub brak hipoteki.');p.cash-=cost;v.mortgaged=false;log(s,`Spłata hipoteki: ${b.name}, −${cost} zł.`);}
 else throw new Error('Nieznana akcja.');settle(s);return s;
}
export function finishDebtMove(s){if(s.status!=='debt'&&s.deferredMove){const steps=s.deferredMove;s.deferredMove=null;move(s,(active(s).position+steps)%BOARD.length,steps);landing(s);}return s;}
export function bankrupt(s){
 requireStatus(s,'debt');const p=active(s),creditor=s.debt.creditor,ownTurn=p.id===s.turn;
 for(const v of s.props){if(v.owner===p.id){v.owner=creditor;v.level=0;if(creditor===null)v.mortgaged=false;}}
 if(creditor!==null)s.players[creditor].cash+=p.cash;
 returnFreeCards(s,p,true);p.cash=0;p.bankrupt=true;p.jail=0;p.skipTurns=0;p.freeCards=0;
 log(s,`${p.name} bankrutuje. ${creditor===null?'Nieruchomości wracają do banku.':`Nieruchomości przejmuje ${s.players[creditor].name}.`}`);
 s.debt=null;s.status='end';if(ownTurn){s.doubles=0;s.payments=null;}checkWinner(s);
 if(s.status==='finished'){s.payments=null;return s;}
 if(!ownTurn){processPayments(s);return s;}
 let next=s.turn;do{next=(next+1)%s.players.length;if(next===0)s.round++;}while(s.players[next].bankrupt);s.turn=next;s.status=active(s).skipTurns>0?'skip':'roll';
 if(s.maxRounds&&s.round>s.maxRounds){s.round=s.maxRounds;s.status='finished';const r=s.players.filter(x=>!x.bankrupt).sort((a,b)=>worth(s,b.id)-worth(s,a.id));const ties=r.filter(x=>worth(s,x.id)===worth(s,r[0].id));s.winner=ties.length===1?r[0].id:null;s.finishReason=ties.length===1?'rounds':'tie';}return s;
}
function tradable(s,id,i){const b=BOARD[i],v=s.props[i];return !!b?.price&&v.owner===id&&!v.level&&(b.group===undefined||!owned(s,id).some(x=>BOARD[x.i].group===b.group&&x.level));}
export function validateTrade(s,t){requireStatus(s,'roll','purchase','end','debt');const from=active(s),to=s.players[t.to];if(!to||to.id===from.id||to.bankrupt)throw new Error('Wybierz innego aktywnego gracza.');for(const n of [t.giveCash,t.getCash])if(!Number.isInteger(n)||n<0)throw new Error('Kwoty muszą być całkowite i nieujemne.');if(t.giveCash>Math.max(0,from.cash)||t.getCash>to.cash)throw new Error('Gracz nie ma tyle gotówki.');if(!Array.isArray(t.give)||!Array.isArray(t.get)||new Set(t.give).size!==t.give.length||new Set(t.get).size!==t.get.length)throw new Error('Nieprawidłowa lista nieruchomości.');if(t.give.some(i=>!tradable(s,from.id,i))||t.get.some(i=>!tradable(s,to.id,i)))throw new Error('Nieruchomości z zabudowaną dzielnicą nie mogą być wymieniane.');if(!t.give.length&&!t.get.length&&!t.giveCash&&!t.getCash)throw new Error('Dodaj coś do oferty.');return true;}
export function tradeValue(s,id,indices){return indices.reduce((sum,i)=>{const b=BOARD[i],v=s.props[i];let val=b.price*(v.mortgaged?.45:1);if(b.group!==undefined){const count=BOARD.filter(x=>x.group===b.group).length;const have=owned(s,id).filter(x=>BOARD[x.i].group===b.group).length;if(have+indices.filter(j=>BOARD[j].group===b.group).length>=count)val*=1.5;else if(have)val*=1.15;}return sum+val;},0);}
export function botAccepts(s,t){validateTrade(s,t);return tradeValue(s,t.to,t.give)+t.giveCash>=tradeValue(s,t.to,t.get)+t.getCash+20;}
export function trade(s,t){validateTrade(s,t);const p=active(s),other=s.players[t.to];for(const i of t.give)s.props[i].owner=other.id;for(const i of t.get)s.props[i].owner=p.id;p.cash+=t.getCash-t.giveCash;other.cash+=t.giveCash-t.getCash;log(s,`${p.name} i ${other.name} zawierają umowę. Wymiana: ${t.give.length+t.get.length} nieruchomości.`);settle(s);return s;}
export function botAction(s){const p=active(s),reserve=s.difficulty==='easy'?300:s.difficulty==='hard'?100:180;
 if(s.status==='auction'){const a=s.auction,b=BOARD[a.i],cpu=s.players[a.current];let limit=b.price*(s.difficulty==='hard'?1.15:.9);if(b.group!==undefined&&owned(s,cpu.id).some(x=>BOARD[x.i].group===b.group))limit*=1.2;return {action:a.bid+20<=Math.min(cpu.cash-reserve,limit)?'bid':'pass',amount:a.bid+20};}
 if(s.status==='roll'||s.status==='end'){for(const v of owned(s,p.id)){if(v.mortgaged&&p.cash>Math.ceil(BOARD[v.i].price*.55)+reserve)return {action:'property',i:v.i,kind:'redeem'};}for(const v of owned(s,p.id)){if(canBuild(s,p.id,v.i)&&p.cash-BOARD[v.i].build>reserve)return {action:'property',i:v.i,kind:'build'};}if(s.status==='roll'){if(p.jail&&p.freeCards)return {action:'jail',card:true};if(p.jail&&p.cash>500)return {action:'jail',card:false};return {action:'roll'};}return {action:'end'};}
 if(s.status==='purchase'){const b=BOARD[p.position];return {action:p.cash-b.price>=reserve?'buy':'auction'};}
 if(s.status==='skip')return {action:'end'};
 if(s.status==='event')return {action:'event',...(s.event.fineOrJail?{choice:p.cash-s.event.fineOrJail>=reserve?'pay':'jail'}:{})};
 if(s.status==='debt'){const o=owned(s,p.id);const buildings=o.filter(v=>v.level>0).sort((a,b)=>b.level-a.level);if(buildings.length)return {action:'property',i:buildings[0].i,kind:'sell'};const assets=o.filter(v=>!v.mortgaged).sort((a,b)=>BOARD[a.i].price-BOARD[b.i].price);if(assets.length)return {action:'property',i:assets[0].i,kind:'mortgage'};return {action:'bankrupt'};}
 return null;
}
export function dispatch(s,a){const draft=upgradeGame(s);for(const p of draft.players)p.skipTurns??=0;const deferred=draft.status==='debt'?draft.debt.afterMove:null;switch(a.action){case'roll':roll(draft);break;case'buy':buy(draft);break;case'auction':startAuction(draft);break;case'bid':bid(draft,a.amount);break;case'pass':passAuction(draft);break;case'event':resolveEvent(draft,a.choice);break;case'end':endTurn(draft);break;case'property':propertyAction(draft,a.i,a.kind);break;case'jail':payJail(draft,a.card);break;case'bankrupt':bankrupt(draft);break;case'trade':trade(draft,a.offer);break;default:throw new Error('Nieznana akcja gry.');}if(deferred&&draft.status!=='debt'&&!draft.players[s.turn].bankrupt){move(draft,(active(draft).position+deferred)%BOARD.length,deferred);landing(draft);}return draft;}
export function validSave(s){try{if(s?.version!==1||!Array.isArray(s.players)||s.players.length<2||s.players.length>4||!Array.isArray(s.props)||![BOARD.length,LEGACY_BOARD_MAP.length].includes(s.props.length)||!Number.isInteger(s.turn)||!s.players[s.turn]||!['roll','purchase','auction','event','end','skip','debt','finished'].includes(s.status))return false;return s.players.every((p,i)=>p.id===i&&Number.isFinite(p.cash)&&Number.isInteger(p.position)&&p.position>=0&&p.position<s.props.length&&typeof p.name==='string'&&(p.skipTurns===undefined||Number.isInteger(p.skipTurns)&&p.skipTurns>=0&&p.skipTurns<=1))&&s.props.every(v=>(v.owner===null||!!s.players[v.owner])&&Number.isInteger(v.level)&&v.level>=0&&v.level<=4)&&!!s.log&&(!s.auction||!!s.players[s.auction.current])&&(s.status!=='skip'||s.players[s.turn].skipTurns===1)&&(s.status!=='debt'||!!s.debt&&!!s.players[s.debt.id]&&!s.players[s.debt.id].bankrupt)&&(s.status!=='event'||!!s.event)&&(s.status!=='auction'||!!s.auction);}catch{return false;}}
