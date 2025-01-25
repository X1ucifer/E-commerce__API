-- AlterTable
ALTER TABLE `product` ADD COLUMN `vendorId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
