// 2단계: 머리 없는 크롬(음소거)에서 앱을 열고 gen.js로 모든 문장을 펼쳐 lines.json에 저장해요
// 먼저 저장소 폴더에서 로컬 서버를 켜 두세요: python -m http.server 8765 --bind 127.0.0.1
//   node tools/voice/run_gen.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const DIR = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9420;
const prof = path.join(os.tmpdir(), 'yuju-voice-gen-prof');   // 크롬 임시 프로필 (저장소 밖)
fs.mkdirSync(prof, { recursive: true });
const proc = spawn(CHROME, ['--headless=new', '--mute-audio', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
async function connect() {
  for (let i = 0; i < 50; i++) {
    try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t => t.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch {}
    await sleep(200);
  }
  throw new Error('no chrome');
}
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600)); return r.result.value; };
try {
  ws = new WebSocket(await connect());
  await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id).res(d.result || {}); pend.delete(d.id); } };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:8765/index.html?gen=' + Date.now() });
  for (let i = 0; i < 50; i++) { await sleep(200); if (await ev(`typeof ALLCH!=='undefined'&&typeof COOK!=='undefined'`)) break; }
  const lits = fs.readFileSync(path.join(DIR, 'literals.json'), 'utf8');
  const gen = fs.readFileSync(path.join(DIR, 'gen.js'), 'utf8');
  const out = await ev(`(${gen})(${lits})`);
  fs.writeFileSync(path.join(DIR, 'lines.json'), JSON.stringify(out, null, 0).replace(/},{/g, '},\n{'), 'utf8');
  const chars = out.reduce((a, o) => a + o.t.length, 0);
  const tags = {}; out.forEach(o => tags[o.tag] = (tags[o.tag] || 0) + 1);
  console.log('lines', out.length, 'chars', chars, JSON.stringify(tags));
} catch (e) { console.log('ERR', e.message); }
finally { try { ws && ws.close(); } catch {} proc.kill(); }
