// 페이지 안에서 돌려요: 앱의 진짜 표와 조사 도우미로 바뀌는 문장을 전부 펼쳐요
(LITS)=>{
const L=new Map();const add=(t,tag)=>{t=sayText(t);if(t&&!L.has(t))L.set(t,tag||'');};
LITS.forEach(t=>add(t,'lit'));
const NAMES=[...new Set([...ALLCH.map(c=>c.name),...(GIRL?[GIRL.name]:[])])];
const SEA=CHARS.map(c=>c.name);
NAMES.forEach(n=>add(n,'name'));
// 퍼즐
items().forEach(it=>{if(it.name)add(it.name,'pz');});
SHAPE_OPTS.forEach(([,n])=>{if(n!=='섞기')add(n+' 모양','pz');});
NAMES.forEach(n=>add('와! '+iyeot(n)+'!','pz'));
['잘했어요!','최고예요!','와, 멋져요!','참 잘했어요!'].forEach(t=>add(t,'pz'));
Object.values(INTRO).forEach(t=>add(t,'intro'));
// 그림
TOOLS.forEach(t=>add(t[2],'draw'));COLORS.forEach(c=>add(c[1],'draw'));
SEA.forEach(n=>{add(`나는 ${iya(n)}! 예쁘게 칠해줘서 고마워!`,'draw');add(`${eul(n)} 예쁘게 칠해요! 톡 눌러 봐요`,'draw');});
// 옷 입히기
DCATS.forEach(c=>add(c[2],'dress'));DITEMS.forEach(it=>add(it.name,'dress'));
// 비눗방울
NUM.forEach(t=>add(t,'num'));NUM.forEach(t=>add(`${t}! 다 터뜨렸어요!`,'bb'));
BTINT.forEach(([,a])=>{add(`이번엔 ${a} 방울만 터뜨려요!`,'bb');add(`${a} 방울을 다 찾았어요!`,'bb');
  BTINT.forEach(([,b])=>{if(a!==b)add(`이건 ${a} 방울이에요. ${b} 방울을 찾아요!`,'bb');});});
NAMES.forEach(n=>{add(`어머! ${ga(n)} 큰 비눗방울 안에 있어요! 톡톡 눌러요!`,'bb');add(`${ga(n)} 나왔어요! 고마워요!`,'bb');add(`고마워! ${ga(n)} 무지개 방울을 불어요! 톡톡 터뜨려요!`,'bb');});
// 까꿍
NAMES.forEach(n=>{add(`나는 ${iya(n)}! 숨을게, 잘 봐!`,'pk');add(`까꿍! ${eul(n)} 찾았어요! 한 친구가 더 있어요`,'pk');add(`까꿍! ${eul(n)} 찾았어요!`,'pk');});
// 밥 주기 + 요리
Object.entries(FEEDS).forEach(([wk,w])=>{const unit=wk==='sea'?'마리':'개';
  const asks=[];w.items.forEach(it=>{asks.push([it,`${it.say} 주세요!`]);asks.push([it,`${it.say} 두 ${unit} 주세요!`]);});
  asks.forEach(([it,a])=>{add(a,'fd');w.items.forEach(o=>{if(o!==it)add(`${o.wrong} ${a}`,'fd');});});
  add(`배가 빵빵해요! ${w.who} 배를 톡톡 두드려 줘요`,'fd');
  const c=COOK[wk==='land'?'land':'sea'];
  ['','이번엔 '].forEach(p=>add(`${p}${iga(w.who)} 배고파요! 맛있는 ${eul(c.dish)} 만들어 줘요!`,'cook'));
  c.ing.forEach(([,nm])=>{add(`${nm} 퐁당!`,'cook');add(`${eul(nm)} 냄비에 넣어요!`,'cook');});
  add(`보글보글! 맛있는 ${c.dish} 다 됐어요!`,'cook');add(`이제 안 뜨거워요! ${w.who}한테 갖다줘요!`,'cook');
  add(`이번엔 ${iga(w.who)} 좋아하는 간식을 줘요!`,'cook');add(`그릇을 톡 눌러서 ${w.who}한테 줘요!`,'cook');
  add(`${w.who} 기분 최고예요! 고마워요!`,'fd');});
add('둘! 배불러요! 고마워요!','fd');
// 그림자
NAMES.forEach(n=>{add(`${n}! 어느 그림자일까요?`,'sh');add(`여기는 ${eul(n).slice(0,-1)} 그림자예요`,'sh');add(`${n}!`,'name');});
// 악단
MU_SONGS.forEach(sg=>add(`${sg.name} 같이 쳐요! 반짝이는 친구를 눌러요`,'mu'));
// 스티커
const KINDS=[...ALLCH.map(c=>'c:'+c.id),...FCOL.map((_,i)=>'f:'+i),...Object.keys(SITEMS).map(k=>'s:'+k)];
KINDS.forEach(k=>{add(stkName(k),'stk');add(`${stkName(k)} 스티커를 받았어요!`,'stk');});
// 친구 꾸미기
FSLOTS.forEach(([,n])=>add(n,'fs'));FITEMS.forEach(f=>add(f.name,'fs'));
FRIENDS.forEach(c=>add(`${c.name} 패션쇼 시작!`,'fs'));
// 기차
NAMES.forEach(n=>{add(`${ga(n)} 탔어요!`,'tr');add(`${ga(n)} 내렸어요!`,'tr');});
// 과일
FRUITS.forEach(k=>{const t=`${eul(k.name)} 따 주세요!`;add(t,'ft');add(`${k.name} 나무예요! ${t}`,'ft');});
FRUITS.forEach(tg=>[2,3].forEach(need=>{const t=`${tg.col} ${tg.name} ${KNUM[need]} 개 따 주세요!`;add(t,'ft');
  FRUITS.forEach(o=>{if(o!==tg)add(`이건 ${o.col} ${ieyo(o.name)}. ${t}`,'ft');});
  for(let n=1;n<=need;n++)add(`${NUM[n-1]}! ${tg.name} ${KNUM[n]} 개!`,'ft');}));
NUM.slice(0,5).forEach(t=>{add(`${t}! 다 땄어요!`,'ft');add(`${t}, 퐁당!`,'ft');});
NAMES.forEach(n=>{add(`이번엔 ${n}한테 줘요!`,'ft');add(`${n}도 냠냠! 다 나눠 줬어요!`,'ft');add(`${n}, 냠냠!`,'ft');add(`${n}, 맛있어요!`,'ft');});
// 생일
Object.values(CK_NAME).forEach(t=>{add(t,'ck');add(`${t}! 우와, 예쁜 케이크예요! 이제 초를 꽂아요!`,'ck');});
NAMES.forEach(n=>{add(`오늘은 ${n} 생일이에요! 케이크를 예쁘게 꾸며 줘요!`,'ck');add(`사랑하는 ${n}, 생일 축하해요! 이제 촛불을 톡 눌러요! 후~`,'ck');add(`와! ${n}, 생일 축하해요!`,'ck');});
// 목욕
NAMES.forEach(n=>{['진흙 놀이를','물감 놀이를'].forEach(k=>add(`${ga(n)} ${k} 했어요! 쓱쓱 문질러 줘요!`,'ba'));
  add(`반짝반짝! ${ga(n)} 깨끗해졌어요!`,'ba');add(`${ga(n)} 침대에 누웠어요. 토닥토닥 해 줘요!`,'ba');add(`잘 자요, ${n}!`,'ba');});
return [...L].map(([t,tag])=>({t,tag}));}
