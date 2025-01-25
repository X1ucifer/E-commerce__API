const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.viewVendorProducts = async (req, res) => {
    try {
        const userId = req.user.id;

        const vendor = await prisma.vendor.findUnique({
            where: { userId: userId },
        });

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found for this user.' });
        }

        const vendorId = vendor.id;

        const products = await prisma.product.findMany({
            where: { vendorId: vendorId },
            include: { images: true },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this vendor.' });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProductForVendor = async (req, res) => {
    const { name, category, description, startDate, deliveryOption, deliveryAmount, oldPrice, newPrice } = req.body;

    try {
        const userId = req.user.id;

        const vendor = await prisma.vendor.findUnique({
            where: { userId: userId },
        });

        if (!vendor) {
            return res.status(403).json({ message: 'You are not a valid vendor.' });
        }

        const vendorId = vendor.id;

        const scheduledStartDate = new Date(startDate);
        const expiryDate = new Date(scheduledStartDate);
        expiryDate.setDate(expiryDate.getDate() + 7);

        const productURL = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const existingProduct = await prisma.product.findUnique({ where: { url: productURL } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product URL must be unique' });
        }

        const isDeliveryOption = deliveryOption === 'true';
        const parsedDeliveryAmount = parseFloat(deliveryAmount);
        const parsedOldPrice = parseFloat(oldPrice);
        const parsedNewPrice = parseFloat(newPrice);

        const productImages = req.files.map((file) => file.path);

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                startDate: scheduledStartDate,
                expiryDate,
                deliveryOption: isDeliveryOption,
                deliveryAmount: isDeliveryOption ? parsedDeliveryAmount : null,
                oldPrice: parsedOldPrice,
                newPrice: parsedNewPrice,
                url: productURL,
                images: {
                    create: productImages.map((imagePath) => ({
                        url: imagePath,
                    })),
                },
                vendor: {
                    connect: {
                        id: vendorId,
                    },
                },
            },
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
