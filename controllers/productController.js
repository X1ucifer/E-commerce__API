const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
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

exports.createProduct = async (req, res) => {
    const { name, category, description, startDate, deliveryOption, deliveryAmount, oldPrice, newPrice, vendorId } = req.body;

    try {
        const vendorIdInt = parseInt(vendorId, 10);

        if (isNaN(vendorIdInt)) {
            return res.status(400).json({ message: 'Invalid vendor ID' });
        }

        const vendorExists = await prisma.vendor.findUnique({
            where: { id: vendorIdInt }
        });

        if (!vendorExists) {
            return res.status(400).json({ message: 'Vendor does not exist' });
        }

        const scheduledStartDate = new Date(startDate);
        if (isNaN(scheduledStartDate)) {
            return res.status(400).json({ message: 'Invalid start date' });
        }

        const expiryDate = new Date(scheduledStartDate);
        expiryDate.setDate(expiryDate.getDate() + 7);

        const productURL = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const existingProduct = await prisma.product.findUnique({ where: { url: productURL } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product URL must be unique' });
        }

        const productImages = req.files.map((file) => ({ url: file.path }));

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                startDate: scheduledStartDate,
                expiryDate,
                deliveryOption: deliveryOption === 'true',
                deliveryAmount: deliveryOption === 'true' ? parseFloat(deliveryAmount) : null,
                oldPrice: parseFloat(oldPrice),
                newPrice: parseFloat(newPrice),
                url: productURL,
                vendorId: vendorIdInt,
                images: {
                    create: productImages,
                },
            },
            include: {
                images: true,
            },
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.viewAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
            },
        });

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.viewAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
            },
        });

        if (vendors.length === 0) {
            return res.status(404).json({ message: 'No vendors found' });
        }

        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.assignStaff = async (req, res) => {
    const { staffId, vendorId, productId, canView, canEdit } = req.body;
  
    try {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
      });
  
      if (!staff) {
        return res.status(400).json({ message: 'Staff not found' });
      }
  
      const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
      });
  
      if (!vendor) {
        return res.status(400).json({ message: 'Vendor not found' });
      }
  
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
  
      if (product.vendorId !== vendorId) {
        return res.status(400).json({ message: 'Product does not belong to this vendor' });
      }
  
      await prisma.staff.update({
        where: { id: staffId },
        data: { vendorId: vendorId }, 
      });
  
      const staffProduct = await prisma.staffProduct.create({
        data: {
          staffId,
          productId,
          vendorId,
          canView,
          canEdit,
        },
      });
  
      res.status(201).json({ message: 'Staff assigned to vendor product successfully', staffProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.viewAllProducts = async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          vendor: true, 
        },
      });
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found.' });
      }
  
      const processedProducts = products.map((product) => {
        const expiryTime = product.expiryDate - new Date(); 
  
        const discountAmount = product.oldPrice - product.newPrice;
        const discountPercentage = ((discountAmount / product.oldPrice) * 100).toFixed(2);
  
        const formattedOldPrice = product.oldPrice.toFixed(2);
        const formattedNewPrice = product.newPrice.toFixed(2);
        const formattedDeliveryAmount = product.deliveryAmount ? product.deliveryAmount.toFixed(2) : null;
  
        return {
          ...product,
          formattedOldPrice,
          formattedNewPrice,
          formattedDeliveryAmount,
          expiryTime,
          discountAmount: discountAmount.toFixed(2), 
          discountPercentage,
        };
      });
  
      res.status(200).json(processedProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.searchProducts = async (req, res) => {
    const { page = 1, limit = 10, searchQuery = '' } = req.query;  
    const offset = (page - 1) * limit;  
  
    try {
      const searchQueryLower = searchQuery.toLowerCase();
  
      const products = await prisma.product.findMany({
        where: {
          name: {
            contains: searchQueryLower,
          },
        },
        include: { vendor: true },  
        skip: offset, 
        take: parseInt(limit),  
      });
  
      const totalProducts = await prisma.product.count({
        where: {
          name: {
            contains: searchQueryLower,
          },
        },
      });
  
      const totalPages = Math.ceil(totalProducts / limit); 
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found matching the search criteria.' });
      }
  
      res.status(200).json({
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        products,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
