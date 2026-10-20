import * as migration_20261016_144059_initial_schema from './20261016_144059_initial_schema';
import * as migration_20261018_101027_catalog_hierarchy from './20261018_101027_catalog_hierarchy';
import * as migration_20261019_150904_datcang_catalog from './20261019_150904_datcang_catalog';
import * as migration_20261019_160756_company_profile from './20261019_160756_company_profile';
import * as migration_20261020_142116_launch_readiness from './20261020_142116_launch_readiness';
import * as migration_20261020_142605_customer_receipt from './20261020_142605_customer_receipt';

export const migrations = [
  {
    up: migration_20261016_144059_initial_schema.up,
    down: migration_20261016_144059_initial_schema.down,
    name: '20261016_144059_initial_schema',
  },
  {
    up: migration_20261018_101027_catalog_hierarchy.up,
    down: migration_20261018_101027_catalog_hierarchy.down,
    name: '20261018_101027_catalog_hierarchy',
  },
  {
    up: migration_20261019_150904_datcang_catalog.up,
    down: migration_20261019_150904_datcang_catalog.down,
    name: '20261019_150904_datcang_catalog',
  },
  {
    up: migration_20261019_160756_company_profile.up,
    down: migration_20261019_160756_company_profile.down,
    name: '20261019_160756_company_profile',
  },
  {
    up: migration_20261020_142116_launch_readiness.up,
    down: migration_20261020_142116_launch_readiness.down,
    name: '20261020_142116_launch_readiness',
  },
  {
    up: migration_20261020_142605_customer_receipt.up,
    down: migration_20261020_142605_customer_receipt.down,
    name: '20261020_142605_customer_receipt'
  },
];
