import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "external_u_r_l" varchar;
  ALTER TABLE "product_categories" ADD COLUMN "source_u_r_l" varchar;
  ALTER TABLE "products" ADD COLUMN "source_u_r_l" varchar;
  ALTER TABLE "products_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_source_u_r_l" varchar;
  ALTER TABLE "_products_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_media_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_media_fk";
  
  DROP INDEX "products_rels_media_id_idx";
  DROP INDEX "_products_v_rels_media_id_idx";
  ALTER TABLE "media" DROP COLUMN "external_u_r_l";
  ALTER TABLE "product_categories" DROP COLUMN "source_u_r_l";
  ALTER TABLE "products" DROP COLUMN "source_u_r_l";
  ALTER TABLE "products_rels" DROP COLUMN "media_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_source_u_r_l";
  ALTER TABLE "_products_v_rels" DROP COLUMN "media_id";`)
}
