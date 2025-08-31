-- AlterTable
ALTER TABLE "public"."influencers" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."influencers" ADD CONSTRAINT "influencers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
