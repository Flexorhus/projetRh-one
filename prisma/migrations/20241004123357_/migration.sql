/*
  Warnings:

  - You are about to drop the column `ordinateurId` on the `Employe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeId]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Employe` DROP FOREIGN KEY `Employe_ordinateurId_fkey`;

-- AlterTable
ALTER TABLE `Employe` DROP COLUMN `ordinateurId`;

-- AlterTable
ALTER TABLE `Ordinateur` ADD COLUMN `employeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_employeId_key` ON `Ordinateur`(`employeId`);

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;