# 구글 TTS 키 읽기 + 목소리 목록 (키는 절대 화면에 찍지 않아요. 헤더로 보내요)
import os, json, sys, urllib.request, urllib.error
KEYF = os.path.join(os.path.expanduser('~'), 'Desktop', 'Google tts key.txt')

def key():
    raw = open(KEYF, 'rb').read()
    for enc in ('utf-8-sig', 'utf-16', 'cp949'):
        try:
            t = raw.decode(enc)
            break
        except Exception:
            continue
    k = ''.join(t.split())
    return k

def call(path, body=None):
    req = urllib.request.Request('https://texttospeech.googleapis.com/v1/' + path,
                                 data=json.dumps(body).encode('utf8') if body is not None else None,
                                 method='POST' if body is not None else 'GET',
                                 headers={'X-Goog-Api-Key': key(), 'Content-Type': 'application/json; charset=utf-8'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode('utf8'))
    except urllib.error.HTTPError as e:
        msg = e.read().decode('utf8', 'replace')[:600]
        raise SystemExit(f'HTTP {e.code}: {msg}')

if __name__ == '__main__':
    k = key()
    print('key ok' if k.startswith('AIza') and 30 < len(k) < 60 else f'key shape odd (len {len(k)}, starts {k[:4]!r})')
    if sys.argv[1:] == ['voices']:
        v = call('voices?languageCode=ko-KR')['voices']
        out = [(x['name'], x['ssmlGender']) for x in v]
        json.dump(out, open(os.path.join(os.path.dirname(__file__), 'gvoices.json'), 'w', encoding='utf8'), ensure_ascii=False)
        from collections import Counter
        print(len(out), Counter(n.split('-')[2] for n, _ in out))
        print(' '.join(n for n, g in out if 'Chirp3' in n))
