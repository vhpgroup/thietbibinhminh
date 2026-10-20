// Series aliases in navigation need explicit memberships: their labels are not
// literal substrings of product names (for example "Dell Tower / Slim").
export async function linkPCSeries(db) {
  const norm = value => value.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').toLowerCase()
  const categories = (await db.query('SELECT id,slug FROM product_categories')).rows
  const products = (await db.query(`SELECT p.id,p.name FROM products p
    JOIN product_categories c ON c.id=p.category_id
    WHERE c.name='Máy tính để bàn'`)).rows
  const rules = {
    'dell-tower-slim': name => /\bdell\b/.test(name) && /\b(tower|slim)\b/.test(name),
    'dell-pro-optiplex': name => /\bdell\b/.test(name) && /\b(pro|optiplex)\b/.test(name),
    'dell-lien-man-hinh': name => /\bdell\b/.test(name) && /\baio\b|lien man/.test(name),
    'hp-280-290': name => /\bhp\b/.test(name) && /\b(280|290)\b/.test(name),
    'elitestudio-prostudio': name => /\bhp\b/.test(name) && /elitestudio|prostudio/.test(name),
    'thinkcentre-m': name => /thinkcentre\s+m\d/i.test(name),
    'asus-expertcenter': name => /\basus\b/.test(name) && /expert\s*center/.test(name),
  }
  const report = []
  for (const [slug, matches] of Object.entries(rules)) {
    const category = categories.find(item => item.slug === slug)
    if (!category) continue
    const ids = products.filter(product => matches(norm(product.name))).map(product => product.id)
    const added = await db.query(`INSERT INTO products_rels (parent_id,path,product_categories_id)
      SELECT source.product_id,'secondaryCategories',$1 FROM unnest($2::int[]) AS source(product_id)
      WHERE NOT EXISTS (SELECT 1 FROM products_rels r WHERE r.parent_id=source.product_id
        AND r.path='secondaryCategories' AND r.product_categories_id=$1)
      RETURNING parent_id`, [category.id, ids])
    report.push({ slug, matched: ids.length, added: added.rowCount })
  }
  return report
}
