# 3단계: 녹음 목소리 파일 만들기. lines.json의 문장마다 voice/<id>/<해시>.mp3 와 voice/list.js 를 만들어요
#   이미 있는 파일은 건너뛰어요(새 문장만 만들어요). 해시 = 문장 글자의 FNV-1a (index.html의 vHash와 같아요)
#   지금 목소리(v46): python tools/voice/build.py . g4 google --voice ko-KR-Chirp3-HD-Callirrhoe --no-name-lines
#   백엔드: google (구글 Cloud TTS, 키는 바탕화면 'Google tts key.txt' → gkey.py)
#           azure (키는 환경 변수 AZURE_SPEECH_KEY / AZURE_SPEECH_REGION 또는 %USERPROFILE%\.azure_speech.txt 에 "키 지역")
#           edge  (미리듣기·시험 전용)
#   --no-name-lines: 아이 이름이 들어간 문장은 외부로 보내지 않아요 (그 문장은 기기 목소리로 읽어요)
import sys, os, json, argparse, asyncio, time, urllib.request
from xml.sax.saxutils import escape

def vhash(t):
    h = 0x811c9dc5
    b = t.encode('utf-16-le')
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 0x01000193) & 0xffffffff
    return '%08x' % h

ap = argparse.ArgumentParser()
ap.add_argument('app'); ap.add_argument('id'); ap.add_argument('backend')
ap.add_argument('--name', default=''); ap.add_argument('--voice', default='ko-KR-SunHiNeural')
ap.add_argument('--pitch', default='+0%'); ap.add_argument('--rate', default='+0%')
ap.add_argument('--only', default=''); ap.add_argument('--no-name-lines', action='store_true')
ap.add_argument('--fmt', default='audio-24khz-48kbitrate-mono-mp3')
A = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__))
L = [o['t'] for o in json.load(open(os.path.join(HERE, 'lines.json'), encoding='utf8'))]
if A.only: L = [t for t in json.load(open(A.only, encoding='utf8')) if t]
NAME_WORD = '유주'   # 아이 이름이 들어간 문장은 허락받았을 때만 외부로 보내요
if A.no_name_lines: L = [t for t in L if NAME_WORD not in t]
ext = 'mp3' if 'mp3' in A.fmt else ('webm' if 'webm' in A.fmt else 'ogg')
out = os.path.join(A.app, 'voice', A.id); os.makedirs(out, exist_ok=True)
hs = {}
for t in L:
    h = vhash(t)
    if h in hs and hs[h] != t: raise SystemExit('hash collision: ' + h)
    hs[h] = t

def azure_cfg():
    k, r = os.environ.get('AZURE_SPEECH_KEY'), os.environ.get('AZURE_SPEECH_REGION')
    f = os.path.join(os.path.expanduser('~'), '.azure_speech.txt')
    if (not k or not r) and os.path.exists(f):
        k, r = open(f, encoding='utf8').read().split()[:2]
    if not k or not r: raise SystemExit('no azure key')
    return k, r

def azure_one(k, r, t, path):
    ssml = (f"<speak version='1.0' xml:lang='ko-KR'><voice name='{A.voice}'>"
            f"<prosody pitch='{A.pitch}' rate='{A.rate}'>{escape(t)}</prosody></voice></speak>")
    req = urllib.request.Request(f'https://{r}.tts.speech.microsoft.com/cognitiveservices/v1', data=ssml.encode('utf8'), method='POST',
        headers={'Ocp-Apim-Subscription-Key': k, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': A.fmt, 'User-Agent': 'voice-builder'})
    for i in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as res: data = res.read()
            if len(data) < 500: raise Exception('short')
            open(path, 'wb').write(data); return
        except Exception as e:
            if i == 4: raise
            time.sleep(2 + i * 3)

async def edge_all(todo):
    import edge_tts
    for h, t in todo:
        p = os.path.join(out, f'{h}.{ext}')
        await edge_tts.Communicate(t, A.voice, pitch=A.pitch if A.pitch.endswith('Hz') else '+0Hz', rate=A.rate).save(p)

todo = [(h, t) for h, t in hs.items() if not os.path.exists(os.path.join(out, f'{h}.{ext}'))]
print('lines', len(hs), 'todo', len(todo))
if A.backend == 'azure':
    k, r = azure_cfg()
    for n, (h, t) in enumerate(todo):
        azure_one(k, r, t, os.path.join(out, f'{h}.{ext}'))
        if n % 50 == 0: print(n, flush=True)
        time.sleep(.05)
elif A.backend == 'edge':
    asyncio.run(edge_all(todo))
elif A.backend == 'google':
    # 구글 Cloud TTS (키: 바탕화면 'Google tts key.txt', gkey.py가 읽어요). 네 개씩 동시에, 막히면 기다렸다 다시
    import base64, threading
    from concurrent.futures import ThreadPoolExecutor
    sys.path.insert(0, HERE)
    import gkey
    done = [0]; lock = threading.Lock()
    def one(ht):
        h, t = ht
        body = {'input': {'text': t}, 'voice': {'languageCode': 'ko-KR', 'name': A.voice}, 'audioConfig': {'audioEncoding': 'MP3'}}
        for i in range(6):
            try:
                r = gkey.call('text:synthesize', body)
                b = base64.b64decode(r['audioContent'])
                if len(b) < 800: raise Exception('short')
                open(os.path.join(out, f'{h}.{ext}'), 'wb').write(b)
                break
            except BaseException as e:
                if i == 5: print('FAIL', h, str(e)[:200], flush=True); return
                time.sleep(3 + i * 5)
        with lock:
            done[0] += 1
            if done[0] % 100 == 0: print(done[0], flush=True)
    with ThreadPoolExecutor(4) as ex: list(ex.map(one, todo))
# 목록: 실제로 있는 파일만
have = [h for h in hs if os.path.exists(os.path.join(out, f'{h}.{ext}'))]
size = sum(os.path.getsize(os.path.join(out, f'{h}.{ext}')) for h in have)
js = ('// 녹음 목소리 목록 (voice/build.py가 만들어요). h = 문장 해시들, 파일은 voice/<id>/<h>.<ext>\n'
      'window.VOICE_PACK=' + json.dumps({'id': A.id, 'name': A.name, 'ext': ext, 'h': ' '.join(sorted(have))}, ensure_ascii=False) + ';\n')
open(os.path.join(A.app, 'voice', 'list.js'), 'w', encoding='utf8', newline='\n').write(js)
print('files', len(have), 'MB', round(size / 1e6, 2))
