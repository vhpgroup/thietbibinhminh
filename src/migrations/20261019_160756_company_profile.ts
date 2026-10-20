import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "hotline" SET DEFAULT '0876 645 432';
  ALTER TABLE "site_settings" ALTER COLUMN "email" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Số 28/136 Lạch Tray, Lê Chân, Hải Phòng';
  ALTER TABLE "site_settings" ADD COLUMN "company_name" varchar DEFAULT 'CÔNG TY TNHH PHÁT TRIỂN THƯƠNG MẠI THIẾT BỊ BÌNH MINH';
  ALTER TABLE "site_settings" ADD COLUMN "business_code" varchar DEFAULT '0202373082';
  ALTER TABLE "site_settings" ADD COLUMN "legal_representative" varchar DEFAULT 'Phạm Thị Thảo';
  ALTER TABLE "site_settings" ADD COLUMN "representative_title" varchar DEFAULT 'Giám đốc';
  INSERT INTO "site_settings" ("company_name", "business_code", "address", "legal_representative", "representative_title", "hotline")
  SELECT 'CÔNG TY TNHH PHÁT TRIỂN THƯƠNG MẠI THIẾT BỊ BÌNH MINH', '0202373082', 'Số 28/136 Lạch Tray, Lê Chân, Hải Phòng', 'Phạm Thị Thảo', 'Giám đốc', '0876 645 432'
  WHERE NOT EXISTS (SELECT 1 FROM "site_settings");
  UPDATE "site_settings" SET "company_name" = 'CÔNG TY TNHH PHÁT TRIỂN THƯƠNG MẠI THIẾT BỊ BÌNH MINH', "business_code" = '0202373082', "address" = 'Số 28/136 Lạch Tray, Lê Chân, Hải Phòng', "legal_representative" = 'Phạm Thị Thảo', "representative_title" = 'Giám đốc', "hotline" = '0876 645 432', "email" = CASE WHEN "email" = 'hello@binhminh.vn' THEN NULL ELSE "email" END;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "hotline" SET DEFAULT '1800 6868';
  ALTER TABLE "site_settings" ALTER COLUMN "email" SET DEFAULT 'hello@binhminh.vn';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Hà Nội, Việt Nam';
  ALTER TABLE "site_settings" DROP COLUMN "company_name";
  ALTER TABLE "site_settings" DROP COLUMN "business_code";
  ALTER TABLE "site_settings" DROP COLUMN "legal_representative";
  ALTER TABLE "site_settings" DROP COLUMN "representative_title";`)
}
