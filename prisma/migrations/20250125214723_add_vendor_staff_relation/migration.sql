-- AlterTable
ALTER TABLE `staff` ADD COLUMN `vendorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
