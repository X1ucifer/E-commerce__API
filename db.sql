-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table ecommerce.product
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `expiryDate` datetime(3) NOT NULL,
  `deliveryOption` tinyint(1) NOT NULL,
  `deliveryAmount` double DEFAULT NULL,
  `oldPrice` double NOT NULL,
  `newPrice` double NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendorId` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_url_key` (`url`),
  KEY `Product_vendorId_fkey` (`vendorId`),
  CONSTRAINT `Product_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.product: ~4 rows (approximately)
INSERT INTO `product` (`id`, `name`, `category`, `description`, `startDate`, `expiryDate`, `deliveryOption`, `deliveryAmount`, `oldPrice`, `newPrice`, `url`, `vendorId`) VALUES
	(1, 'sample', 'Electronics', 'A high-quality product.', '2025-02-01 00:00:00.000', '2025-02-08 00:00:00.000', 1, 50, 1000, 800, 'sample-1737843731469', 1),
	(4, 'sample', 'Electronics', 'A high-quality product.', '2025-02-01 00:00:00.000', '2025-02-08 00:00:00.000', 1, 50, 1000, 800, 'sample-1737843931548', 1),
	(5, 'sample', 'Electronics', 'A high-quality product.', '2025-02-01 00:00:00.000', '2025-02-08 00:00:00.000', 1, 50, 1000, 800, 'sample-1737845757311', 1),
	(6, 'sample', 'Electronics', 'A high-quality product.', '2025-02-01 00:00:00.000', '2025-02-08 00:00:00.000', 1, 50, 1000, 800, 'sample-1737847520601', 1);

-- Dumping structure for table ecommerce.productimage
CREATE TABLE IF NOT EXISTS `productimage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ProductImage_productId_fkey` (`productId`),
  CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.productimage: ~5 rows (approximately)
INSERT INTO `productimage` (`id`, `url`, `productId`) VALUES
	(1, 'uploads\\1737843731464-pexels-sound-on-3756750 (1).jpg', 1),
	(2, 'uploads\\1737843731467-pexels-sound-on-3756863 (1).jpg', 1),
	(3, 'uploads\\1737843931544-pexels-sound-on-3756750 (1).jpg', 4),
	(4, 'uploads\\1737843931546-pexels-sound-on-3756863 (1).jpg', 4),
	(5, 'uploads\\1737845757306-pexels-sound-on-3756750 (1).jpg', 5),
	(6, 'uploads\\1737847520593-pexels-sound-on-3756750 (1).jpg', 6);

-- Dumping structure for table ecommerce.role
CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.role: ~4 rows (approximately)
INSERT INTO `role` (`id`, `name`, `description`) VALUES
	(1, 'admin', 'Administrator with full access'),
	(2, 'staff', 'Staff member with limited access'),
	(3, 'vendor', 'Vendor with access to their own data'),
	(4, 'user', 'Regular user with basic access');

-- Dumping structure for table ecommerce.staff
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `department` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Staff_userId_key` (`userId`),
  KEY `Staff_vendorId_fkey` (`vendorId`),
  CONSTRAINT `Staff_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Staff_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.staff: ~1 rows (approximately)
INSERT INTO `staff` (`id`, `userId`, `department`, `position`, `firstName`, `gender`, `lastName`, `vendorId`) VALUES
	(1, 2, 'Sales', 'Manager', 'John', 'Male', 'Doe', 1);

-- Dumping structure for table ecommerce.staffproduct
CREATE TABLE IF NOT EXISTS `staffproduct` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `productId` int NOT NULL,
  `vendorId` int NOT NULL,
  `canView` tinyint(1) NOT NULL DEFAULT '1',
  `canEdit` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `StaffProduct_staffId_fkey` (`staffId`),
  KEY `StaffProduct_productId_fkey` (`productId`),
  KEY `StaffProduct_vendorId_fkey` (`vendorId`),
  CONSTRAINT `StaffProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StaffProduct_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StaffProduct_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.staffproduct: ~1 rows (approximately)
INSERT INTO `staffproduct` (`id`, `staffId`, `productId`, `vendorId`, `canView`, `canEdit`) VALUES
	(3, 1, 4, 1, 1, 1);

-- Dumping structure for table ecommerce.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  KEY `User_roleId_fkey` (`roleId`),
  CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.user: ~4 rows (approximately)
INSERT INTO `user` (`id`, `password`, `createdAt`, `updatedAt`, `username`, `roleId`) VALUES
	(1, '$2a$10$FyUh3B.J6AY27UzaV2MS4.uZhPuXqGzt4q1mC9OQtS0N3qvWqluO6', '2025-01-25 22:12:19.349', '2025-01-25 22:12:19.349', 'admin', 1),
	(2, '$2a$10$vJr2PMDD0TG1uYI2W2Gmxu.JVyR9o7huQPVsXZSJQ0Bdaw4CN7VhK', '2025-01-25 22:15:29.431', '2025-01-25 22:15:29.431', 'staffuser', 2),
	(3, '$2a$10$s5gRcCq1uZYqlJ2uDMOS0u39K6kwjjqYCRdSvZtSrHXBVyaeZ37o.', '2025-01-25 22:18:16.714', '2025-01-25 22:18:16.714', 'akhil', 4),
	(4, '$2a$10$F9E7xNUxby2Y6KUkHqQmhO9fm9/1uWOBTPasJQ8REZ6W3UHml8qXm', '2025-01-25 22:18:47.055', '2025-01-25 22:18:47.055', 'akhil-vendor', 3);

-- Dumping structure for table ecommerce.vendor
CREATE TABLE IF NOT EXISTS `vendor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `storeName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Vendor_userId_key` (`userId`),
  CONSTRAINT `Vendor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce.vendor: ~1 rows (approximately)
INSERT INTO `vendor` (`id`, `userId`, `storeName`, `description`) VALUES
	(1, 4, 'demo store', 'new');

-- Dumping structure for table ecommerce._prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce._prisma_migrations: ~0 rows (approximately)
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('3a5cb0e2-40cd-4f6a-95dc-335c366d53a1', '3aa9376fb99288030a98fd2614e80a776690186ef2013071a6183267a1ec6856', '2025-01-25 22:08:41.405', '20250125214723_add_vendor_staff_relation', NULL, NULL, '2025-01-25 22:08:41.349', 1),
	('5bf47f04-8bb5-4694-aaac-fa41887dec37', 'a3ecbf86cc6ab0b7f09fc6841bfbbb0fc27ef88ab85eebc8cab59cc335b30bc2', '2025-01-25 22:08:40.949', '20250125192155_user_model', NULL, NULL, '2025-01-25 22:08:40.918', 1),
	('820f3685-3ff5-454b-8df8-25cd3b1551fe', '14eeebcb6f528e36187b36a33272786a12b6ac0229fc57d68171de873c025441', '2025-01-25 22:08:41.161', '20250125193723_add_role_id_to_user', NULL, NULL, '2025-01-25 22:08:40.980', 1),
	('83d5f3af-321d-43e7-97b1-3cbbd5f385d3', '90ed72856fdfb88ba8721a282303cb356be8187c48990a02fa3f7bcc4e709055', '2025-01-25 22:08:40.977', '20250125192325_user_model', NULL, NULL, '2025-01-25 22:08:40.952', 1),
	('96ece8e8-8f9d-422a-88e5-73a082ef6b3e', 'e88c0d84b9e2dac455f747bb56b1c8367e2c70b880a23b8841d6c3e8fd2eb4c8', '2025-01-25 22:08:41.463', '20250125220806_add_vendor_relation_to_product', NULL, NULL, '2025-01-25 22:08:41.408', 1),
	('af7e1b35-6582-41ee-b668-17fa06ce77d8', '38418f05879f78d5f6a97897768e6a67e1dea26e12358508f24d09bf1ba9bc66', '2025-01-25 22:08:41.331', '20250125204821_add_product_images', NULL, NULL, '2025-01-25 22:08:41.258', 1),
	('c6a2cb8c-fc02-4fb2-996d-d7f623e8baa2', 'c94fc8e79870223ebd8dc5fd017939ff50cb6ddecf3a1fd06029e7b86346d61a', '2025-01-25 22:08:41.346', '20250125213139_add_staff_details', NULL, NULL, '2025-01-25 22:08:41.334', 1),
	('f8d138cb-ea93-4efd-9ca4-4091f1ae013b', 'e68a1610375d4231848f77ae18e9d03ebee6b3ed1742910cf4fc4805d166b72d', '2025-01-25 22:08:41.256', '20250125193900_user_model', NULL, NULL, '2025-01-25 22:08:41.164', 1),
	('fe814679-049e-4633-b131-54ae54ba121c', '49e1366f957561a4688894119876125633a553f39e6c14e482376be01efa2b4d', '2025-01-25 22:31:37.921', '20250125223137_staff_products', NULL, NULL, '2025-01-25 22:31:37.786', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
