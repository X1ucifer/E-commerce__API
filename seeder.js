const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async function seedRoles() {
  const roles = [
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'staff', description: 'Staff member with limited access' },
    { name: 'vendor', description: 'Vendor with access to their own data' },
    { name: 'user', description: 'Regular user with basic access' }
  ];

  try {
    for (const role of roles) {
      const existingRole = await prisma.role.findUnique({
        where: { name: role.name }
      });

      if (!existingRole) {
        await prisma.role.create({
          data: role
        });
        console.log(`Role '${role.name}' created.`);
      } else {
        console.log(`Role '${role.name}' already exists.`);
      }
    }

    console.log('Roles seeding completed.');
  } catch (err) {
    console.error('Error seeding roles:', err.message);
  } finally {
    await prisma.$disconnect();
  }
})();
