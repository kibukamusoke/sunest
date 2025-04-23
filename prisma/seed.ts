import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user',
    },
  });

  console.log('Created roles:', { adminRole, userRole });

  // Create permissions
  const readPermission = await prisma.permission.upsert({
    where: { name: 'read' },
    update: {},
    create: {
      name: 'read',
      description: 'Read access',
    },
  });

  const writePermission = await prisma.permission.upsert({
    where: { name: 'write' },
    update: {},
    create: {
      name: 'write',
      description: 'Write access',
    },
  });

  const adminPermission = await prisma.permission.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Admin access',
    },
  });

  console.log('Created permissions:', { readPermission, writePermission, adminPermission });

  // Assign permissions to roles
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: [
          { id: readPermission.id },
          { id: writePermission.id },
          { id: adminPermission.id },
        ],
      },
    },
  });

  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: {
        connect: [
          { id: readPermission.id },
        ],
      },
    },
  });

  console.log('Assigned permissions to roles');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      displayName: 'Admin User',
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  console.log('Created admin user:', adminUser);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });