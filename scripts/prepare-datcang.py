"""Read the source catalog without modifying it; emit an auditable import manifest."""
import collections, hashlib, html, json, re, sqlite3, sys, unicodedata
from pathlib import Path
from urllib.parse import urlparse

source = Path(sys.argv[1] if len(sys.argv)>1 else 'C:/Users/mrduy/Downloads/dat_cang_catalog.sqlite')
out = Path(sys.argv[2] if len(sys.argv)>2 else '.tmp-datcang.json')
db = sqlite3.connect(source.resolve().as_uri()+'?mode=ro', uri=True)
db.row_factory=sqlite3.Row
def norm(s):
    return re.sub(r'\s+', ' ', ''.join(c for c in unicodedata.normalize('NFD',s.lower().replace('đ','d')) if unicodedata.category(c)!='Mn')).strip()
def slug(s): return re.sub('[^a-z0-9]+','-',norm(s)).strip('-')
def clean(s): return re.sub(r'\s+',' ',html.unescape(s or '').replace('\u200b','').replace('\ufeff','')).strip()
cats=[dict(r) for r in db.execute('select * from categories order by id')]
byid={c['id']:c for c in cats}
used=set()
for c in sorted(cats,key=lambda c:(c['parent_id'] is not None,c['id'])):
    c['name']=clean(c['name'])
    base=slug(c['name'])
    c['slug']=base if base not in used else f"{base}-{c['id']}"
    used.add(c['slug'])
brands=[dict(r) for r in db.execute('select * from brands')]
for b in brands:
    b['name']=clean(b['name'])
    b['slug']=slug(b['name']) or f"brand-{b['id']}"
brands.append(dict(id=0,name='Chưa xác định',slug='chua-xac-dinh',source_url=None))
brandby={b['id']:b for b in brands}
attrs=collections.defaultdict(lambda:collections.defaultdict(list))
for r in db.execute('select v.product_id,a.name,v.value from product_attribute_values v join attributes a on a.id=v.attribute_id order by v.product_id,a.id,v.value'):
    key,value=clean(r['name']),clean(r['value'])
    if value not in attrs[r['product_id']][key]: attrs[r['product_id']][key].append(value)
members=collections.defaultdict(list)
for r in db.execute('select * from product_categories'):members[r['product_id']].append(r['category_id'])
images=collections.defaultdict(list)
media={}
for r in db.execute('select * from images order by product_id,position,id'):
    url=r['image_url']
    if not url or urlparse(url).scheme!='https':continue
    filename='dc-'+hashlib.sha256(url.encode()).hexdigest()[:24]+Path(urlparse(url).path).suffix.lower()
    media.setdefault(filename,dict(filename=filename,url=url,alt=clean(r['alt_text']) or Path(urlparse(url).path).stem))
    if filename not in images[r['product_id']]:images[r['product_id']].append(filename)
prices={r['product_id']:r['amount_vnd'] or 0 for r in db.execute('select * from price_observations order by observed_at_utc,id')}
products=[]
counts=collections.Counter()
for row in db.execute('select * from products order by id'):
    p=dict(row); pid=p['id']; values=attrs[pid]
    p['name']=clean(p['name'])
    p['slug']=urlparse(p['product_url']).path.strip('/').split('/')[-1] or slug(p['name'])
    p['brand_id']=p['brand_id'] or 0
    p['categories']=members[pid][:]
    p['category_id']=next((i for i in members[pid] if byid[i]['kind']=='taxonomy'),members[pid][0])
    p['images']=images[pid];p['price']=prices.get(pid,0)
    p['specs']=[dict(label=k,value='; '.join(v)) for k,v in values.items()]
    p['short_spec']='; '.join(values.get('Cấu hình rút gọn',[]))
    p['description']='\n'.join(values.get('Mô tả khác',[]))
    # Only add memberships with direct textual/brand evidence. Opaque dm IDs
    # are not guessed. Original source memberships remain unchanged.
    root=next(i for i in members[pid] if byid[i]['kind']=='main_menu')
    name=norm(p['name']);brand=norm(brandby[p['brand_id']]['name'])
    matched=set(members[pid])
    for c in cats:
        if c['kind']!='menu_link':continue
        ancestry=[];a=c
        while a['parent_id']:
            a=byid[a['parent_id']];ancestry.append(a)
        if a['id']!=root:continue
        label=norm(c['name']);label=re.sub(r'\b(hot|new)\b','',label).strip()
        parent=byid[c['parent_id']]
        parentlabel=norm(parent['name'])
        evidence=False
        # Brand-specific listings have an explicit named brand and are
        # constrained to the source product's main category.
        if parent['kind']=='menu_group' and 'hang' in parentlabel and brand and brand!='chua xac dinh':
            evidence=bool(re.search(r'(?<![a-z0-9])'+re.escape(brand)+r'(?![a-z0-9])',label))
        if not evidence and len(label)>=4 and label not in ('phan mem khac','may tinh bang'):
            evidence=bool(re.search(r'(?<![a-z0-9])'+re.escape(label)+r'(?![a-z0-9])',name))
        if 'gia' in parentlabel and 'trieu' in label and p['price']>0:
            limits=[float(n) for n in re.findall(r'\d+(?:\.\d+)?',label)]
            amount=p['price']/1000000
            if len(limits)==2:evidence=limits[0]<=amount<limits[1]
            elif len(limits)==1:
                if 'duoi' in label:evidence=amount<limits[0]
                elif 'tren' in label:evidence=amount>=limits[0]
        if re.fullmatch(r'ram \d+gb',label):
            capacity=re.search(r'\d+',label)[0]
            ram=' '.join(' '.join(v) for k,v in values.items() if 'ram' in norm(k) or 'bo nho trong' in norm(k))
            evidence=bool(re.search(r'(?<!\d)'+capacity+r'\s*gb\b',norm(ram)))
        if 'cpu' in parentlabel:
            cpu=norm(' '.join(' '.join(v) for k,v in values.items() if 'cpu' in norm(k) or 'bo vi xu ly' in norm(k)))+' '+name
            variants=[label.replace('intel ','').replace('amd ','')]
            aliases={'intel core 7 / i7':['core 7','core i7'],'intel core 5 / i5':['core 5','core i5'],'intel core 3 / i3':['core 3','core i3']}
            variants=aliases.get(label,variants)
            evidence=any(re.search(r'(?<![a-z0-9])'+re.escape(v)+r'(?![a-z0-9])',cpu) for v in variants)
        # A series nested under a brand may only match that brand's products.
        if parent['kind']=='menu_link' and parent['id'] not in matched:evidence=False
        if evidence:matched.add(c['id'])
    p['categories']=sorted(matched)
    for i in matched:
        counts[i]+=1
    products.append(p)
# Enable populated branches and their ancestors; retain empty source nodes in CMS.
visible=set(counts)
for i in list(visible):
    a=byid[i]
    while a['parent_id']:
        visible.add(a['parent_id']);a=byid[a['parent_id']]
icons=['laptop','laptop','laptop','laptop','laptop','network','network','power','printer','printer','software']
roots=[c for c in cats if not c['parent_id']]
for c in cats:
    c['show_in_menu']=c['kind']!='taxonomy'
    c['icon']=icons[roots.index(c)] if c in roots else None
result=dict(source=str(source),categories=cats,brands=brands,media=list(media.values()),products=products)
out.write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
report=dict(products=len(products),categories=len(cats),roots=len(roots),brands=len(brands),unique_images=len(media),image_relationships=sum(len(p['images']) for p in products),spec_rows=sum(len(p['specs']) for p in products),visible_categories=sum(c['show_in_menu'] for c in cats),without_images=sum(not p['images'] for p in products),without_price=sum(not p['price'] for p in products),category_counts=[dict(name=c['name'],id=c['id'],direct_products=counts[c['id']]) for c in cats if counts[c['id']]])
out.with_suffix('.report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='category_counts'},ensure_ascii=False))
