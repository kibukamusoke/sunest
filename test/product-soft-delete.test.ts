import { Test, TestingModule } from '@nestjs/testing';
import { ProductCatalogService } from '../src/modules/product-catalog/product-catalog.service';
import { PrismaService } from '../src/config/prisma.service';
import { NotificationService } from '../src/modules/notifications/notification.service';
import { ProductStatus } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Product Soft Delete', () => {
  let service: ProductCatalogService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockNotificationService = {
    sendAll: jest.fn(),
    sendToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCatalogService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<ProductCatalogService>(ProductCatalogService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteProduct', () => {
    it('should soft delete a product by setting status to DELETED', async () => {
      const productId = 'test-product-id';
      const mockProduct = {
        id: productId,
        status: ProductStatus.DRAFT,
        name: 'Test Product',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        status: ProductStatus.DELETED,
        isActive: false,
      });

      await service.deleteProduct(productId);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: {
          status: ProductStatus.DELETED,
          isActive: false,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const productId = 'non-existent-product-id';
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.deleteProduct(productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if product is already deleted', async () => {
      const productId = 'deleted-product-id';
      const mockProduct = {
        id: productId,
        status: ProductStatus.DELETED,
        name: 'Deleted Product',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.deleteProduct(productId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProducts', () => {
    it('should exclude deleted products from results', async () => {
      const mockProducts = [
        { id: '1', status: ProductStatus.PUBLISHED, name: 'Product 1' },
        { id: '2', status: ProductStatus.DRAFT, name: 'Product 2' },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(2);

      await service.getProducts({}, 'merchant-id');

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { not: ProductStatus.DELETED },
          }),
        }),
      );
    });
  });

  describe('getProductById', () => {
    it('should exclude deleted products', async () => {
      const productId = 'test-product-id';
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.getProductById(productId)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: productId,
          status: { not: ProductStatus.DELETED },
        },
        include: expect.any(Object),
      });
    });
  });
});
