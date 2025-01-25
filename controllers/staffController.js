const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createStaff = async (req, res) => {
    const { username, password, department, position, firstName, lastName, gender } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const role = await prisma.role.findUnique({ where: { name: 'staff' } });
        if (!role) {
            return res.status(400).json({ message: 'Role "staff" not found' });
        }

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                roleId: role.id,
                staff: {
                    create: {
                        department,
                        position,
                        firstName,
                        lastName,
                        gender
                    },
                },
            },
        });

        res.status(201).json({ message: 'Staff created successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.viewStaffProducts = async (req, res) => {
    try {
        const staffId = req.user.id;

        const staff = await prisma.staff.findUnique({
            where: { userId: staffId },
            include: { vendor: true }
        });

        if (!staff || !staff.vendor) {
            return res.status(403).json({ message: 'You are not assigned to any vendor' });
        }

        const staffProducts = await prisma.staffProduct.findMany({
            where: {
                staffId: staff.id,
                vendorId: staff.vendor.id,
                canView: true,
            },
            include: {
                product: {
                    include: { images: true },
                },
            },
        });

        if (staffProducts.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to view any products for this vendor' });
        }

        const products = staffProducts.map((staffProduct) => staffProduct.product);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProductForStaff = async (req, res) => {
    const { name, category, description, startDate, deliveryOption, deliveryAmount, oldPrice, newPrice } = req.body;

    try {
        const staffId = req.user.id;

        const staff = await prisma.staff.findUnique({
            where: { userId: staffId },
            include: { vendor: true },
        });

        if (!staff || !staff.vendor) {
            return res.status(403).json({ message: 'You are not assigned to any vendor' });
        }

        const staffProductPermission = await prisma.staffProduct.findFirst({
            where: {
                staffId: staff.id,
                vendorId: staff.vendor.id,
                canEdit: true,
            },
        });

        if (!staffProductPermission) {
            return res.status(403).json({ message: 'You do not have permission to add products for this vendor' });
        }

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
                        id: staff.vendor.id,
                    },
                },
            },
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


