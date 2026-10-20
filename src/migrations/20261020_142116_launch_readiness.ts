import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { policyPages } from '../lib/policy-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_notification_status" AS ENUM('pending', 'sending', 'sent', 'failed');
  CREATE TABLE "policies_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"content" varchar NOT NULL
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "shipping_message" SET DEFAULT 'Tư vấn giao hàng và lắp đặt theo nhu cầu';
  ALTER TABLE "site_settings" ALTER COLUMN "email" SET DEFAULT 'kinhdoanh@thietbibinhminh.com.vn';
  ALTER TABLE "products" ADD COLUMN "price_verified" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "price_verified_at" timestamp(3) with time zone;
  ALTER TABLE "products" ADD COLUMN "stock_verified" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "stock_verified_at" timestamp(3) with time zone;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_verified" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_verified_at" timestamp(3) with time zone;
  ALTER TABLE "_products_v" ADD COLUMN "version_stock_verified" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_stock_verified_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "notification_status" "enum_contact_submissions_notification_status" DEFAULT 'pending';
  ALTER TABLE "contact_submissions" ADD COLUMN "notification_error" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "notification_sent_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "notification_attempted_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "notification_lease" varchar;
  ALTER TABLE "policies_pages" ADD CONSTRAINT "policies_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "policies_pages_order_idx" ON "policies_pages" USING btree ("_order");
  CREATE INDEX "policies_pages_parent_id_idx" ON "policies_pages" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE TABLE submission_limits (key varchar(64) NOT NULL, bucket bigint NOT NULL, hits integer NOT NULL, PRIMARY KEY (key,bucket));
    CREATE INDEX submission_limits_bucket_idx ON submission_limits(bucket);
    UPDATE contact_submissions SET notification_status=NULL;
    UPDATE site_settings SET email='kinhdoanh@thietbibinhminh.com.vn', shipping_message=CASE WHEN shipping_message='Miễn phí giao hàng toàn quốc cho đơn từ 1 triệu' THEN 'Tư vấn giao hàng và lắp đặt theo nhu cầu' ELSE shipping_message END;
    INSERT INTO policies (created_at,updated_at) VALUES (now(),now());`)
  for (const [index, page] of policyPages.entries()) {
    await db.execute(sql`INSERT INTO policies_pages (_order,_parent_id,id,slug,title,summary,content) SELECT ${index + 1},id,${'policy-' + page.slug},${page.slug},${page.title},${page.summary},${page.content} FROM policies LIMIT 1`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS submission_limits;`)
  await db.execute(sql`
   ALTER TABLE "policies_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "policies" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "policies_pages" CASCADE;
  DROP TABLE "policies" CASCADE;
  ALTER TABLE "site_settings" ALTER COLUMN "shipping_message" SET DEFAULT 'Miễn phí giao hàng toàn quốc cho đơn từ 1 triệu';
  ALTER TABLE "site_settings" ALTER COLUMN "email" DROP DEFAULT;
  ALTER TABLE "products" DROP COLUMN "price_verified";
  ALTER TABLE "products" DROP COLUMN "price_verified_at";
  ALTER TABLE "products" DROP COLUMN "stock_verified";
  ALTER TABLE "products" DROP COLUMN "stock_verified_at";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_verified";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_verified_at";
  ALTER TABLE "_products_v" DROP COLUMN "version_stock_verified";
  ALTER TABLE "_products_v" DROP COLUMN "version_stock_verified_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "notification_status";
  ALTER TABLE "contact_submissions" DROP COLUMN "notification_error";
  ALTER TABLE "contact_submissions" DROP COLUMN "notification_sent_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "notification_attempted_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "notification_lease";
  DROP TYPE "public"."enum_contact_submissions_notification_status";`)
}
