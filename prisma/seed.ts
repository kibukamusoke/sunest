import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Apps model has been removed from schema - Hardware World is now a single-tenant platform

  // Create Hardware World specific roles
  const systemAdminRole = await prisma.role.upsert({
    where: { name: 'system_admin' },
    update: {},
    create: {
      name: 'system_admin',
      description: 'System Administrator - Platform oversight and configuration',
    },
  });

  const merchantAdminRole = await prisma.role.upsert({
    where: { name: 'merchant_admin' },
    update: {},
    create: {
      name: 'merchant_admin',
      description: 'Merchant Administrator - Manage merchant account and users',
    },
  });

  const merchantUserRole = await prisma.role.upsert({
    where: { name: 'merchant_user' },
    update: {},
    create: {
      name: 'merchant_user',
      description: 'Merchant User - Day-to-day merchant operations',
    },
  });

  const buyerRole = await prisma.role.upsert({
    where: { name: 'buyer' },
    update: {},
    create: {
      name: 'buyer',
      description: 'Buyer - Corporate procurement user',
    },
  });

  // Keep legacy roles for backward compatibility
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

  console.log('Created roles:', { systemAdminRole, merchantAdminRole, merchantUserRole, buyerRole, adminRole, userRole });

  // Create Hardware World specific permissions
  const systemManagePermission = await prisma.permission.upsert({
    where: { name: 'system:manage' },
    update: {},
    create: {
      name: 'system:manage',
      description: 'Manage system-wide settings and users',
    },
  });

  const merchantManagePermission = await prisma.permission.upsert({
    where: { name: 'merchant:manage' },
    update: {},
    create: {
      name: 'merchant:manage',
      description: 'Manage merchant account and settings',
    },
  });

  const merchantApprovePermission = await prisma.permission.upsert({
    where: { name: 'merchant:approve' },
    update: {},
    create: {
      name: 'merchant:approve',
      description: 'Approve/reject merchant applications',
    },
  });

  const productManagePermission = await prisma.permission.upsert({
    where: { name: 'product:manage' },
    update: {},
    create: {
      name: 'product:manage',
      description: 'Manage product catalog',
    },
  });

  const orderManagePermission = await prisma.permission.upsert({
    where: { name: 'order:manage' },
    update: {},
    create: {
      name: 'order:manage',
      description: 'Manage orders and fulfillment',
    },
  });

  const rfqManagePermission = await prisma.permission.upsert({
    where: { name: 'rfq:manage' },
    update: {},
    create: {
      name: 'rfq:manage',
      description: 'Manage RFQs and quotes',
    },
  });

  const buyerActionsPermission = await prisma.permission.upsert({
    where: { name: 'buyer:actions' },
    update: {},
    create: {
      name: 'buyer:actions',
      description: 'Browse, purchase, and manage buyer activities',
    },
  });

  // Legacy permissions
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

  console.log('Created permissions:', {
    systemManagePermission,
    merchantManagePermission,
    merchantApprovePermission,
    productManagePermission,
    orderManagePermission,
    rfqManagePermission,
    buyerActionsPermission,
    readPermission,
    writePermission,
    adminPermission
  });

  // Assign permissions to Hardware World roles

  // System Admin - Full system access
  await prisma.role.update({
    where: { id: systemAdminRole.id },
    data: {
      permissions: {
        connect: [
          { id: systemManagePermission.id },
          { id: merchantApprovePermission.id },
          { id: readPermission.id },
          { id: writePermission.id },
          { id: adminPermission.id },
        ],
      },
    },
  });

  // Merchant Admin - Manage their merchant account
  await prisma.role.update({
    where: { id: merchantAdminRole.id },
    data: {
      permissions: {
        connect: [
          { id: merchantManagePermission.id },
          { id: productManagePermission.id },
          { id: orderManagePermission.id },
          { id: rfqManagePermission.id },
          { id: readPermission.id },
          { id: writePermission.id },
        ],
      },
    },
  });

  // Merchant User - Limited merchant operations
  await prisma.role.update({
    where: { id: merchantUserRole.id },
    data: {
      permissions: {
        connect: [
          { id: productManagePermission.id },
          { id: orderManagePermission.id },
          { id: rfqManagePermission.id },
          { id: readPermission.id },
          { id: writePermission.id },
        ],
      },
    },
  });

  // Buyer - Purchase and browse
  await prisma.role.update({
    where: { id: buyerRole.id },
    data: {
      permissions: {
        connect: [
          { id: buyerActionsPermission.id },
          { id: readPermission.id },
        ],
      },
    },
  });

  // Legacy role assignments
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

  // Create admin users for Hardware World B2B platform
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const systemAdmin = await prisma.user.upsert({
    where: { email: 'admin@hardwareworld.com' },
    update: {},
    create: {
      email: 'admin@hardwareworld.com',
      password: hashedPassword,
      displayName: 'System Administrator',
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: systemAdminRole.id }],
      },
    },
  });

  // Create a demo merchant admin user
  const merchantAdminUser = await prisma.user.upsert({
    where: { email: 'merchant@hardwareworld.com' },
    update: {},
    create: {
      email: 'merchant@hardwareworld.com',
      password: hashedPassword,
      displayName: 'Merchant Administrator',
      isActive: true,
      emailVerified: true,

      roles: {
        connect: [{ id: merchantAdminRole.id }],
      },
    },
  });

  // Create a merchant user
  const merchantUser = await prisma.user.upsert({
    where: { email: 'user@merchant.com' },
    update: {},
    create: {
      email: 'user@merchant.com',
      password: hashedPassword,
      displayName: 'Merchant User',
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: merchantUserRole.id }],
      },
    },
  });

  // Create a buyer user
  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@company.com' },
    update: {},
    create: {
      email: 'buyer@company.com',
      password: hashedPassword,
      displayName: 'Corporate Buyer',
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: buyerRole.id }],
      },
    },
  });

  // Create Hardware World sample data

  // Create sample company for buyers
  const sampleCompany = await prisma.company.upsert({
    where: { name: 'Acme Corporation' },
    update: {},
    create: {
      name: 'Acme Corporation',
      displayName: 'Acme Corporation',
      description: 'Leading manufacturing company',
      industry: 'Manufacturing',
      website: 'https://acme.com',
      addressLine1: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      taxId: 'TAX123456789',
      creditLimit: 100000.00,
      paymentTerms: 'NET30',
      isActive: true,
      isVerified: true,
    },
  });

  // Create sample merchant
  const sampleMerchant = await prisma.merchant.upsert({
    where: { name: 'TechParts Supplier' },
    update: {},
    create: {
      name: 'TechParts Supplier',
      displayName: 'TechParts Supplier Inc.',
      description: 'Premium electronic components supplier',
      businessType: 'distributor',
      contactEmail: 'sales@techparts.com',
      contactPhone: '+1-555-0200',
      website: 'https://techparts.com',
      addressLine1: '456 Supplier Blvd',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      taxId: 'TECH789123456',
      minimumOrderValue: 100.00,
      tin: 'TIN111222333',
      idType: 'BRN',
      idValue: '202301023456',
      eInvoiceOptIn: true,
      status: 'APPROVED',
      isActive: true,
    },
  });

  // Create detailed buyer user
  const acmeBuyer = await prisma.user.upsert({
    where: { email: 'buyer@acme.com' },
    update: {},
    create: {
      email: 'buyer@acme.com',
      password: hashedPassword,
      displayName: 'Jane Buyer',
      firstName: 'Jane',
      lastName: 'Buyer',
      phoneNumber: '+1-555-0101',
      jobTitle: 'Procurement Manager',
      department: 'Operations',
      approvalLimit: 50000.00,
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: buyerRole.id }],
      },
    },
  });

  // Create merchant admin user
  const techPartsMerchantAdmin = await prisma.user.upsert({
    where: { email: 'admin@techparts.com' },
    update: {},
    create: {
      email: 'admin@techparts.com',
      password: hashedPassword,
      displayName: 'Mike Merchant',
      firstName: 'Mike',
      lastName: 'Merchant',
      phoneNumber: '+1-555-0201',
      jobTitle: 'Sales Director',
      department: 'Sales',
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: merchantAdminRole.id }],
      },
    },
  });

  // Create merchant user
  const techPartsMerchantUser = await prisma.user.upsert({
    where: { email: 'sales@techparts.com' },
    update: {},
    create: {
      email: 'sales@techparts.com',
      password: hashedPassword,
      displayName: 'Sarah Sales',
      firstName: 'Sarah',
      lastName: 'Sales',
      phoneNumber: '+1-555-0202',
      jobTitle: 'Sales Representative',
      department: 'Sales',
      isActive: true,
      emailVerified: true,
      roles: {
        connect: [{ id: merchantUserRole.id }],
      },
    },
  });

  // Connect buyer to company
  await prisma.userCompany.upsert({
    where: {
      userId_companyId: {
        userId: acmeBuyer.id,
        companyId: sampleCompany.id,
      },
    },
    update: {},
    create: {
      userId: acmeBuyer.id,
      companyId: sampleCompany.id,
      role: 'manager',
      isActive: true,
    },
  });

  // Connect merchant users to merchant
  await prisma.userMerchant.upsert({
    where: {
      userId_merchantId: {
        userId: techPartsMerchantAdmin.id,
        merchantId: sampleMerchant.id,
      },
    },
    update: {},
    create: {
      userId: techPartsMerchantAdmin.id,
      merchantId: sampleMerchant.id,
      role: 'admin',
      canManageProducts: true,
      canManageOrders: true,
      canManagePricing: true,
      canViewAnalytics: true,
      isActive: true,
    },
  });

  await prisma.userMerchant.upsert({
    where: {
      userId_merchantId: {
        userId: techPartsMerchantUser.id,
        merchantId: sampleMerchant.id,
      },
    },
    update: {},
    create: {
      userId: techPartsMerchantUser.id,
      merchantId: sampleMerchant.id,
      role: 'user',
      canManageProducts: true,
      canManageOrders: true,
      canManagePricing: false,
      canViewAnalytics: false,
      isActive: true,
    },
  });

  console.log('Created users:', {
    systemAdmin,
    merchantAdminUser,
    merchantUser,
    buyerUser,
    acmeBuyer,
    techPartsMerchantAdmin,
    techPartsMerchantUser
  });

  console.log('Created Hardware World entities:', {
    sampleCompany,
    sampleMerchant
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