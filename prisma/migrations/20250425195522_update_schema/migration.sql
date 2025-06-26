/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `application` DROP FOREIGN KEY `application_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `application` DROP FOREIGN KEY `application_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    ADD COLUMN `hashedPassword` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `account` RENAME INDEX `Account_userId_fkey` TO `Account_userId_idx`;

-- RenameIndex
ALTER TABLE `application` RENAME INDEX `Application_jobId_fkey` TO `Application_jobId_idx`;

-- RenameIndex
ALTER TABLE `application` RENAME INDEX `Application_userId_fkey` TO `Application_userId_idx`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_userId_fkey` TO `Session_userId_idx`;
