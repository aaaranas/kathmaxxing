-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "conversions" (
    "id" SERIAL NOT NULL,
    "input_value" TEXT NOT NULL,
    "input_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversions_created_at_idx" ON "conversions"("created_at" DESC);
