const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async function createDefaultAdmin() {
    const defaultAdmin = {
      username: 'admin',
      password: 'admin123', 
      role: 'admin'
    };
  
    try {
      const adminRole = await prisma.role.findUnique({
        where: { name: defaultAdmin.role }
      });
  
      if (!adminRole) {
        console.error('Admin role not found. Please create roles in the Role table first.');
        return;
      }
  
      const existingAdmin = await prisma.user.findUnique({
        where: { username: defaultAdmin.username }
      });
  
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
        await prisma.user.create({
          data: {
            username: defaultAdmin.username,
            password: hashedPassword,
            role: { connect: { id: adminRole.id } } // Connect the user to the admin role
          }
        });
        console.log('Default admin account created.');
      } else {
        console.log('Default admin account already exists.');
      }
    } catch (err) {
      console.error('Error creating default admin:', err.message);
    }
  })();

  exports.register = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
      if (!userRole) {
        return res.status(400).json({ message: 'Default role "user" does not exist. Please seed the Role table first.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: { connect: { id: userRole.id } }
        }
      });
  
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.registerVendor = async (req, res) => {
    const { username, password, storeName, description } = req.body;
  
    try {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const vendorRole = await prisma.role.findUnique({ where: { name: 'vendor' } });
      if (!vendorRole) {
        return res.status(400).json({ message: 'Vendor role does not exist. Please seed the Role table first.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const vendor = await prisma.vendor.create({
        data: {
          storeName,
          description,
          user: {
            create: {
              username,
              password: hashedPassword,
              role: { connect: { id: vendorRole.id } } 
            }
          }
        },
        include: { user: true } 
      });
  
      res.status(201).json({ message: 'Vendor registered successfully', vendor });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.roleId }, 'SECRET_KEY', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
