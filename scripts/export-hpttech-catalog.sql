-- Read-only projection from the HPTTech PostgreSQL backup.
-- Deliberately excludes customers, users, orders, leads, and private notes.
SELECT json_build_object(
  'sourceId', p.id,
  'slug', p.slug,
  'name', coalesce(nullif(p.name, ''), p.title),
  'sourceSku', p.sku,
  'category', json_build_object(
    'slug', c.slug, 'name', c.name, 'description', c.description,
    'icon', c.icon, 'order', c.sort_order
  ),
  'brand', json_build_object('slug', b.slug, 'name', b.name, 'website', b.website),
  'image', json_build_object(
    'sourceId', m.id, 'filename', m.filename, 'url', m.url, 'alt', m.alt,
    'width', m.width, 'height', m.height
  ),
  'priceText', p.price,
  'oldPriceText', p.compare_at_price,
  'shortSpec', nullif(p.short_description, ''),
  'description', left(regexp_replace(coalesce(p.summary_h_t_m_l, ''), '<[^>]+>', ' ', 'g'), 2000),
  'featured', coalesce(p.featured, false),
  'rating', p.rating,
  'reviews', p.review_count,
  'stockStatus', p.stock_status::text,
  'badge', p.discount_badge
)
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN brands b ON b.id = p.brand_id
LEFT JOIN LATERAL (
  SELECT m.id, m.filename, m.url, m.alt, m.width, m.height
  FROM products_rels r
  JOIN media m ON m.id = r.media_id
  WHERE r.parent_id = p.id AND r.path = 'images'
  ORDER BY r."order" NULLS LAST, r.id
  LIMIT 1
) m ON true
WHERE p._status = 'published'
  AND p.slug IS NOT NULL
  AND coalesce(nullif(p.name, ''), p.title) IS NOT NULL
ORDER BY p.id;
