# 코덱스 그림의 흰 배경 지우기: python tools/art/cut.py 원본.png chars/이름.webp 긴쪽px [흰색기준=240] [soft]
# 흰 배경 지우기: 테두리와 이어진 흰색만 (soft=흰색을 투명도로 바꾸기, 부드러운 자국용)
import sys
from PIL import Image,ImageDraw,ImageFilter
import numpy as np
src,dst,long=sys.argv[1],sys.argv[2],int(sys.argv[3]);thr=int(sys.argv[4]) if len(sys.argv)>4 else 240;soft=len(sys.argv)>5 and sys.argv[5]=='soft'
im=Image.open(src).convert('RGBA')
if soft:
  a=np.asarray(im).astype(np.float32);rgb=a[...,:3];al=(255-rgb.min(axis=2))/255.0
  al=np.clip((al-.02)/.98,0,1);out=np.zeros_like(a)
  nz=al>0;out[...,:3][nz]=np.clip((rgb[nz]-255*(1-al[nz,None]))/al[nz,None],0,255);out[...,3]=al*255
  im=Image.fromarray(out.astype(np.uint8),'RGBA')
else:
  w,h=im.size;rgb=im.convert('RGB');mask=Image.new('L',(w,h),0)
  # 테두리에서 시작해 흰색(thr 이상)만 채워요
  arr=np.asarray(rgb);white=(arr.min(axis=2)>=thr)
  from collections import deque
  seen=np.zeros((h,w),bool);q=deque()
  for x in range(w):
    for y in (0,h-1):
      if white[y,x] and not seen[y,x]:seen[y,x]=True;q.append((y,x))
  for y in range(h):
    for x in (0,w-1):
      if white[y,x] and not seen[y,x]:seen[y,x]=True;q.append((y,x))
  while q:
    y,x=q.popleft()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
      ny,nx=y+dy,x+dx
      if 0<=ny<h and 0<=nx<w and white[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
  m=Image.fromarray(((~seen)*255).astype(np.uint8),'L').filter(ImageFilter.GaussianBlur(1.2))
  im.putalpha(m)
bb=im.getchannel('A').point(lambda v:255 if v>8 else 0).getbbox();im=im.crop(bb)
w,h=im.size;pad=int(max(w,h)*.03);c=Image.new('RGBA',(w+pad*2,h+pad*2),(0,0,0,0));c.alpha_composite(im,(pad,pad));im=c
k=long/max(im.size);im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
im.save(dst,'WEBP',quality=88,method=6);print(dst,im.size,round(im.width/im.height,3))
