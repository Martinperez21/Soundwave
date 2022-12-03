/*
  Warnings:

  - You are about to drop the column `email` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `username` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `email`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;
