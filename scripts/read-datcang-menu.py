from html.parser import HTMLParser
import json,re,sys
from pathlib import Path
from urllib.parse import urljoin
class Node:
 def __init__(self,tag='',attrs=(),parent=None):self.tag=tag;self.attrs=dict(attrs);self.parent=parent;self.children=[]
 def text(self):return ''.join(c.text() if isinstance(c,Node) else c for c in self.children)
 def find(self,fn):
  for c in self.children:
   if isinstance(c,Node):
    if fn(c):yield c
    yield from c.find(fn)
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.root=Node();self.current=self.root
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs,self.current);self.current.children.append(n)
  if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):self.current=n
 def handle_endtag(self,tag):
  n=self.current
  while n.parent:
   if n.tag==tag:self.current=n.parent;return
   n=n.parent
 def handle_data(self,data):self.current.children.append(data)
p=Parser();p.feed(Path(sys.argv[1] if len(sys.argv)>1 else '.tmp-datcang-live.html').read_text(encoding='utf-8'))

def text(n):return re.sub(r'\s+',' ',n.text()).replace('›','').strip()
def classes(n):return n.attrs.get('class','').split()
def link(n):return dict(name=text(n),url=urljoin('https://maytinhdatcang.vn',n.attrs.get('href','')),children=[])
rows={}
for n in p.root.find(lambda n:n.tag=='a' and 'data-mrow' in n.attrs and 'catrow' in classes(n)):
 key=int(n.attrs['data-mrow'])
 if key<12 and key!=4:rows.setdefault(key,link(n))
for n in p.root.find(lambda n:'mega' in classes(n) and 'data-mpanel' in n.attrs):
 key=int(n.attrs['data-mpanel'])
 if key not in rows or rows[key]['children']:continue
 for g in n.find(lambda n:'mgc' in classes(n)):
  headings=list(g.find(lambda n:n.tag=='h5'))
  if not headings:continue
  title=text(headings[0])
  if 'dịch vụ' in title.lower() or title.lower()=='bảo hành mở rộng':continue
  group=dict(name=title,url=None,children=[])
  for item in g.children:
   if not isinstance(item,Node):continue
   if item.tag=='a':group['children'].append(link(item))
   elif 'dcpa-co' in classes(item):
    anchors=list(item.find(lambda n:n.tag=='a'))
    if anchors:
     entry=link(anchors[0]);entry['children']=[link(a) for a in anchors[1:]];group['children'].append(entry)
  rows[key]['children'].append(group)
result=list(rows.values())
Path('scripts/datcang-menu.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([{"name":r['name'],"groups":len(r['children']),"links":sum(len(g['children']) for g in r['children'])} for r in result],ensure_ascii=False))
