-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."Platform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'X');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'VIEWER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."influencers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "engagement_rate" DECIMAL(5,2) NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "categories" TEXT[],
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "influencers_platform_idx" ON "public"."influencers"("platform");

-- CreateIndex
CREATE INDEX "influencers_followers_idx" ON "public"."influencers"("followers");

-- CreateIndex
CREATE INDEX "influencers_engagement_rate_idx" ON "public"."influencers"("engagement_rate");

-- CreateIndex
CREATE INDEX "influencers_country_idx" ON "public"."influencers"("country");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_platform_username_key" ON "public"."influencers"("platform", "username");
