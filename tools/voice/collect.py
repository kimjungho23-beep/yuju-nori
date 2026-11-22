# 1단계: index.html에서 say()/sayNow()로 말하는 고정 문장을 모아 literals.json에 저장해요.
#   값이 바뀌는 문장(이름·색·과일 등)은 gen.js가 앱의 진짜 표로 펼쳐요 → run_gen.mjs
#   python tools/voice/collect.py
import re, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
s = open(os.path.join(ROOT, 'index.html'), encoding='utf8').read()

# say( ... ) 인자를 괄호 짝을 맞춰 꺼내요 (문자열·템플릿 안의 괄호는 건너뛰어요)
calls = []
for m in re.finditer(r'\b(say|sayNow)\(', s):
    i = m.end(); d = 1; q = None; j = i
    while j < len(s) and d > 0:
        c = s[j]
        if q:
            if c == chr(92): j += 2; continue
            if c == q: q = None
            elif q == '`' and s.startswith('${', j):
                k = j + 2; dd = 1
                while dd > 0:
                    if s[k] == '{': dd += 1
                    elif s[k] == '}': dd -= 1
                    k += 1
                j = k; continue
        else:
            if c in '\'"`': q = c
            elif c == '(': d += 1
            elif c == ')': d -= 1
        j += 1
    calls.append(s[i:j - 1].strip())

PAT = re.compile(r"'([^'\\]*[가-힣][^'\\]*)'")
lits = []
for a in calls:
    if re.fullmatch(r"'[^']*'", a): lits.append(a[1:-1]); continue
    lits += [m.group(1) for m in PAT.finditer(a)]
for m in re.finditer(r"muStory0\(([^;]*?)\);", s):   # 악단 첫말은 변수로 넘어가요
    lits += [k.group(1) for k in PAT.finditer(m.group(1))]
# 템플릿 조각(앞뒤 빈칸, 조사만 붙은 말)은 빼요 — 완성 문장은 gen.js가 만들어요
lits = [x for x in lits if x == x.strip() and x not in ('진흙 놀이를', '물감 놀이를', '섞기')]
json.dump(sorted(set(lits)), open(os.path.join(HERE, 'literals.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print('say calls', len(calls), 'literals', len(set(lits)))
