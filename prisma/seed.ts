import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default apps
  const portainerApp = await prisma.app.upsert({
    where: { name: 'portainer' },
    update: {},
    create: {
      name: 'portainer',
      displayName: 'Portainer Manager',
      description: 'Docker container management application',
      domain: 'portainer.example.com',
      isActive: true,
    },
  });

  const dockerApp = await prisma.app.upsert({
    where: { name: 'docker-manager' },
    update: {},
    create: {
      name: 'docker-manager',
      displayName: 'Docker Manager',
      description: 'Advanced Docker management platform',
      domain: 'docker.example.com',
      isActive: true,
    },
  });

  const testApp = await prisma.app.upsert({
    where: { name: 'test-app' },
    update: {},
    create: {
      name: 'test-app',
      displayName: 'Test Application',
      description: 'Development and testing environment',
      domain: 'test.example.com',
      isActive: true,
    },
  });

  console.log('Created apps:', { portainerApp, dockerApp, testApp });

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

  // Create admin users for each app
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const portainerAdmin = await prisma.user.upsert({
    where: {
      email_appId: {
        email: 'admin@portainer.com',
        appId: portainerApp.id,
      }
    },
    update: {},
    create: {
      email: 'admin@portainer.com',
      password: hashedPassword,
      displayName: 'Portainer Admin',
      isActive: true,
      emailVerified: true,
      appId: portainerApp.id,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  const dockerAdmin = await prisma.user.upsert({
    where: {
      email_appId: {
        email: 'admin@docker.com',
        appId: dockerApp.id,
      }
    },
    update: {},
    create: {
      email: 'admin@docker.com',
      password: hashedPassword,
      displayName: 'Docker Admin',
      isActive: true,
      emailVerified: true,
      appId: dockerApp.id,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  // Create a super admin that can access all apps (for the admin portal)
  const superAdmin = await prisma.user.upsert({
    where: {
      email_appId: {
        email: 'super@admin.com',
        appId: portainerApp.id, // Default to portainer app
      }
    },
    update: {},
    create: {
      email: 'super@admin.com',
      password: hashedPassword,
      displayName: 'Super Admin',
      isActive: true,
      emailVerified: true,
      appId: portainerApp.id,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  // Create same email user for different apps (to demonstrate multi-tenancy)
  const portainerUser = await prisma.user.upsert({
    where: {
      email_appId: {
        email: 'user@example.com',
        appId: portainerApp.id,
      }
    },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      displayName: 'Portainer User',
      isActive: true,
      emailVerified: true,
      appId: portainerApp.id,
      roles: {
        connect: [{ id: userRole.id }],
      },
    },
  });

  const dockerUser = await prisma.user.upsert({
    where: {
      email_appId: {
        email: 'user@example.com',
        appId: dockerApp.id,
      }
    },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      displayName: 'Docker User',
      isActive: true,
      emailVerified: true,
      appId: dockerApp.id,
      roles: {
        connect: [{ id: userRole.id }],
      },
    },
  });

  console.log('Created users:', {
    portainerAdmin,
    dockerAdmin,
    superAdmin,
    portainerUser,
    dockerUser
  });

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