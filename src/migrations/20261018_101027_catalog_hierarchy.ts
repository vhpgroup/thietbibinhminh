import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer
  );
  
  ALTER TABLE "product_categories" ADD COLUMN "parent_id" integer;
  ALTER TABLE "product_categories" ADD COLUMN "show_in_menu" boolean DEFAULT true;
  ALTER TABLE "product_categories" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "product_categories" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "product_categories" ADD COLUMN "indexable" boolean DEFAULT true;
  ALTER TABLE "products" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "products" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_product_categories_id_idx" ON "products_rels" USING btree ("product_categories_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_product_categories_id_idx" ON "_products_v_rels" USING btree ("product_categories_id");
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_categories_parent_idx" ON "product_categories" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_parent_id_product_categories_id_fk";
  
  DROP INDEX "product_categories_parent_idx";
  ALTER TABLE "product_categories" DROP COLUMN "parent_id";
  ALTER TABLE "product_categories" DROP COLUMN "show_in_menu";
  ALTER TABLE "product_categories" DROP COLUMN "seo_title";
  ALTER TABLE "product_categories" DROP COLUMN "seo_description";
  ALTER TABLE "product_categories" DROP COLUMN "indexable";
  ALTER TABLE "products" DROP COLUMN "seo_title";
  ALTER TABLE "products" DROP COLUMN "seo_description";
  ALTER TABLE "_products_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_products_v" DROP COLUMN "version_seo_description";`)
}
