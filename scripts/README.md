# HPTTech catalog snapshot

`hpttech-catalog-20261008.jsonl` is a public-catalog-only extract from the
user-provided PostgreSQL backup dated 08/10/2026. It contains published product
names, slugs, category and brand names, price text, short descriptions, ratings,
and image references. It excludes users, customers, orders, quotes, and internal
notes.

The source dump is PostgreSQL custom format v1.16. It can be restored with
PostgreSQL 17 tools. `export-hpttech-catalog.sql` produces the JSONL projection
from a restored HPTTech database.

To import the extract into a migrated Bình Minh database:

```powershell
$env:DATABASE_URL = 'postgres://payload:payload@localhost:5434/binhminh'
node scripts/import-hpttech-catalog.mjs scripts/hpttech-catalog-20261008.jsonl
```

The import is idempotent by category, brand, image filename, and product slug.
Imported SKUs use `HPT-<source id>` so they remain unique. Prices are historical
reference values; source stock status does not include a reliable quantity, so
imported stock is zero pending confirmation.

The dump contains media metadata but no image binaries. Product images are read
from the HPTTech Cloudflare R2 bucket through `/r2/[filename]`; configure the
five `R2_*` values in the local `.env` file. Products without an image reference
or whose R2 object cannot be read show a category placeholder.


## Dat Cang category reconciliation

`sync-datcang-menu.mjs` also runs category reconciliation after syncing navigation.
The classifier uses product taxonomy, brand and explicit specifications. It distinguishes
installed RAM from maximum supported RAM, printer hardware from ink, AIO from towers,
and accessories from tablets. Uncertain memberships are not invented.

```powershell
node --test scripts/catalog-category-rules.test.mjs
node scripts/audit-category-memberships.mjs          # Preview only
node scripts/audit-category-memberships.mjs --apply  # Backup and reconcile
```

Set `DATABASE_URL` before running. The apply command backs up existing category
relationships under `.backups/`, uses a transaction and checks fingerprints of
products, posts, customer requests and site settings before committing. Repeated
runs with unchanged data make no changes.


## Manufacturer catalog supplement

`catalog-supplement-20261020.json` records independently verified additions, source URLs, exact image provenance and required categories. Run `node scripts/import-catalog-supplement.mjs` with `DATABASE_URL` to add them. Prices and stock start at zero; repeated runs preserve existing product records. Source images live in `public/catalog-supplement/` and ship with the app. Original catalog, news, submissions and company settings are fingerprinted and preserved.
