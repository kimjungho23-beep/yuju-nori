# 목소리 높이 올리기 (v51): 녹음 파일의 높이만 바꾸고 빠르기·길이는 그대로 (ffmpeg rubberband)
#   구글 Chirp3-HD 목소리는 높이(pitch) 옵션을 안 받아서, 만든 뒤에 이걸로 올려요.
#   한꺼번에: python tools/voice/shift.py . g4 g5 1.5   (voice/list.js의 문장만, 결과는 voice/g5 + list.js의 id를 g5로)
#   build.py --semi 1.5 를 주면 새로 만든 문장도 저절로 이걸로 올려요.
#   ffmpeg는 파이썬 패키지 imageio-ffmpeg에 든 것을 써요 (pip install imageio-ffmpeg)
import os, sys, re, json, subprocess
from concurrent.futures import ThreadPoolExecutor

def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()

def shift_file(src, dst, semi, ff=None):
    """src mp3 → dst mp3, 높이를 semi 반음만큼 (24kHz 모노 40kbps)"""
    ff = ff or ffmpeg()
    tmp = dst + '.tmp.mp3'
    subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-y', '-i', src,
                    '-af', f'aresample=24000,rubberband=pitch={2 ** (semi / 12):.6f}:pitchq=quality',
                    '-ac', '1', '-ar', '24000', '-b:a', '40k', tmp], check=True)
    os.replace(tmp, dst)

if __name__ == '__main__':
    app, src_id, dst_id, semi = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    lj = os.path.join(app, 'voice', 'list.js')
    txt = open(lj, encoding='utf8').read()
    pack = json.loads(re.search(r'window\.VOICE_PACK=(\{.*\});', txt).group(1))
    ext, hs = pack['ext'], pack['h'].split()
    sd, dd = os.path.join(app, 'voice', src_id), os.path.join(app, 'voice', dst_id)
    os.makedirs(dd, exist_ok=True)
    ff = ffmpeg()
    todo = [h for h in hs if not os.path.exists(os.path.join(dd, f'{h}.{ext}'))]
    print('files', len(hs), 'todo', len(todo), flush=True)
    done = [0]
    def one(h):
        shift_file(os.path.join(sd, f'{h}.{ext}'), os.path.join(dd, f'{h}.{ext}'), semi, ff)
        done[0] += 1
        if done[0] % 200 == 0: print(done[0], flush=True)
    with ThreadPoolExecutor(8) as ex: list(ex.map(one, todo))
    have = [h for h in hs if os.path.exists(os.path.join(dd, f'{h}.{ext}'))]
    pack['id'] = dst_id; pack['h'] = ' '.join(sorted(have))
    open(lj, 'w', encoding='utf8').write(txt[:txt.index('window.VOICE_PACK=')] + 'window.VOICE_PACK=' + json.dumps(pack, ensure_ascii=False) + ';\n')
    size = sum(os.path.getsize(os.path.join(dd, f'{h}.{ext}')) for h in have)
    print('ok', len(have), 'MB', round(size / 1e6, 1))
