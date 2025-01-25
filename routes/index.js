const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { createProduct, viewAllUsers, viewAllVendors, assignStaff, viewAllProducts, searchProducts } = require('../controllers/productController');
const { createStaff, viewStaffProducts, addProductForStaff  } = require('../controllers/staffController');
const { viewVendorProducts, addProductForVendor } = require('../controllers/vendorController');
const { verifyAdmin, verifyStaff, verifyVendor, verifyUserRole } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/vendor-registration', authController.registerVendor);

// Admin Routes
router.post('/products', verifyAdmin, upload.array('images'), createProduct);
router.get('/users', verifyAdmin, viewAllUsers);
router.get('/vendors', verifyAdmin, viewAllVendors);
router.post('/create-staff', verifyAdmin, createStaff);
router.post('/assign-staff', verifyAdmin, assignStaff); 

// Staff routes
router.get('/staff/products', verifyStaff, viewStaffProducts);  
router.post('/staff/products', verifyStaff, upload.array('images'), addProductForStaff); 

// vendor routes
router.get('/vendor/products', verifyVendor, viewVendorProducts);
router.post('/vendor/products', verifyVendor, upload.array('images'), addProductForVendor);

// user routes
router.get('/products', verifyUserRole, viewAllProducts);

// common routes
router.get('/products/search', searchProducts);

module.exports = router;