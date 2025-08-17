# Product Snapshot System for Order Items

## Overview

The Product Snapshot System ensures that order items maintain complete product and variant information as it existed at the time of order placement. This is crucial for maintaining accurate order history, proper accounting, and audit trails, especially when product details change after an order has been placed.

## Problem Statement

In e-commerce systems, product information frequently changes:
- **Pricing Updates**: Product prices change due to market conditions, promotions, or cost adjustments
- **Specification Changes**: Product descriptions, features, or technical specifications are updated
- **Image Updates**: Product images are replaced with newer or better photos
- **Categorization Changes**: Products may be moved to different categories
- **Availability Changes**: Products may be discontinued or marked as inactive
- **Variant Updates**: Product variants may have their attributes, pricing, or availability modified

Without proper snapshot preservation, these scenarios can occur:
- **Incorrect Order History**: Past orders show current product details instead of what was actually ordered
- **Pricing Discrepancies**: Financial reports show current prices instead of the prices at time of purchase
- **Audit Trail Issues**: Compliance and audit requirements cannot be met due to incomplete historical data
- **Customer Service Problems**: Support teams cannot see what the customer actually ordered
- **Legal Issues**: Disputes cannot be resolved due to lack of accurate historical product data

## Solution: Product Snapshot System

### Core Concept

When an order item is created, the system automatically captures and stores a complete snapshot of:
1. **Product Data**: Complete product information including name, SKU, brand, description, specifications, images, category, and merchant details
2. **Variant Data**: If applicable, complete variant information including SKU, attributes, pricing, images, weight, and dimensions
3. **Snapshot Metadata**: Timestamp of when the snapshot was created and denormalized key fields for quick access

### Database Schema Enhancement

#### OrderItem Model Extensions

```prisma
model OrderItem {
  // ... existing fields ...

  // Product snapshot at time of order (preserves original product data)
  productSnapshot Json? // Complete product data at time of order
  variantSnapshot Json? // Complete variant data at time of order
  
  // Snapshot metadata
  snapshotCreatedAt DateTime? // When the snapshot was taken
  productName       String    // Product name at time of order
  productSku        String    // Product SKU at time of order
  productBrand      String?   // Product brand at time of order
  productCategory   String?   // Product category at time of order
  productImages     String[]  // Product images at time of order
  
  // Variant snapshot fields (if applicable)
  variantName       String?   // Variant name at time of order
  variantSku        String?   // Variant SKU at time of order  
  variantAttributes Json?     // Variant attributes at time of order

  // ... other fields ...
}
```

### Data Captured in Snapshots

#### Product Snapshot (productSnapshot JSON field)
```json
{
  "id": "uuid-product-id",
  "name": "Industrial Steel Bolt M8x50",
  "sku": "ISB-M8x50-001",
  "brand": "SteelCorp",
  "description": "High-strength steel bolt with zinc coating...",
  "specifications": {
    "material": "Grade 8.8 Steel",
    "coating": "Zinc Plated",
    "threadPitch": "1.25mm",
    "length": "50mm",
    "diameter": "8mm"
  },
  "images": [
    "https://cdn.example.com/products/bolt-m8x50-main.jpg",
    "https://cdn.example.com/products/bolt-m8x50-side.jpg"
  ],
  "category": {
    "id": "uuid-category-id",
    "name": "Fasteners",
    "description": "Industrial fastening solutions"
  },
  "merchant": {
    "id": "uuid-merchant-id",
    "name": "Industrial Supply Co",
    "businessName": "Industrial Supply Company LLC"
  },
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-07-20T14:45:00Z"
}
```

#### Variant Snapshot (variantSnapshot JSON field)
```json
{
  "id": "uuid-variant-id",
  "sku": "ISB-M8x50-001-SS",
  "attributes": {
    "finish": "Stainless Steel",
    "grade": "A4-80",
    "packaging": "Box of 100"
  },
  "price": 45.99,
  "compareAtPrice": 52.99,
  "costPrice": 28.50,
  "images": [
    "https://cdn.example.com/variants/bolt-ss-m8x50.jpg"
  ],
  "weight": 0.025,
  "dimensions": {
    "length": 50,
    "diameter": 8,
    "headDiameter": 13
  },
  "status": "ACTIVE",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-07-20T15:00:00Z"
}
```

#### Denormalized Fields (for quick access)
- `productName`: "Industrial Steel Bolt M8x50"
- `productSku`: "ISB-M8x50-001-SS"  
- `productBrand`: "SteelCorp"
- `productCategory`: "Fasteners"
- `productImages`: ["https://cdn.example.com/products/bolt-m8x50-main.jpg", ...]
- `variantName`: "Industrial Steel Bolt M8x50 - {"finish":"Stainless Steel","grade":"A4-80"}"
- `variantSku`: "ISB-M8x50-001-SS"
- `variantAttributes`: {"finish":"Stainless Steel","grade":"A4-80","packaging":"Box of 100"}

## Implementation Details

### Automatic Snapshot Creation

The system automatically creates snapshots during order creation in the `createOrder` method:

```typescript
// Simplified flow
1. For each order item with productId:
   - Fetch complete product data with relations (category, merchant)
   - Store full product object in productSnapshot JSON field
   - Extract key fields to denormalized columns for quick access

2. For each order item with productVariantId:
   - Fetch complete variant data with product relations
   - Store full variant object in variantSnapshot JSON field
   - Extract key fields to denormalized columns
   - If no product snapshot exists, also capture product data

3. For custom/quote-derived items:
   - Use provided custom product details
   - Mark as custom/quote category
   - Store relevant snapshot metadata
```

### Snapshot Creation Process

#### 1. Product Data Capture
```typescript
if (item.productId) {
  const product = await this.prisma.product.findUnique({
    where: { id: item.productId },
    include: {
      category: true,
      merchant: true
    }
  });

  if (product) {
    // Store complete product snapshot
    productSnapshot = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      description: product.description,
      specifications: product.specifications,
      images: product.images,
      category: product.category,
      merchant: product.merchant,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    // Store denormalized fields for quick access
    snapshotData = {
      productSnapshot,
      snapshotCreatedAt: new Date(),
      productName: product.name,
      productSku: product.sku,
      productBrand: product.brand,
      productCategory: product.category?.name,
      productImages: product.images || []
    };
  }
}
```

#### 2. Variant Data Capture
```typescript
if (item.productVariantId) {
  const variant = await this.prisma.productVariant.findUnique({
    where: { id: item.productVariantId },
    include: {
      product: {
        include: {
          category: true,
          merchant: true
        }
      }
    }
  });

  if (variant) {
    // Store complete variant snapshot
    variantSnapshot = {
      id: variant.id,
      sku: variant.sku,
      attributes: variant.attributes,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      costPrice: variant.costPrice,
      images: variant.images,
      weight: variant.weight,
      dimensions: variant.dimensions,
      status: variant.status,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt
    };

    // Store variant-specific denormalized data
    snapshotData = {
      ...snapshotData,
      variantSnapshot,
      variantName: `${variant.product?.name} - ${JSON.stringify(variant.attributes)}`,
      variantSku: variant.sku,
      variantAttributes: variant.attributes
    };
  }
}
```

### API Response Enhancement

The OrderItemResponseDto now includes snapshot fields:

```typescript
export class OrderItemResponseDto {
  // ... existing fields ...

  // Product snapshot data (preserves product state at time of order)
  productSnapshot?: any;
  variantSnapshot?: any;
  snapshotCreatedAt?: Date;
  productName: string;
  productSku: string;
  productBrand?: string;
  productCategory?: string;
  productImages?: string[];
  variantName?: string;
  variantSku?: string;
  variantAttributes?: any;

  // ... other fields ...
}
```

## Use Cases and Benefits

### 1. Order History Accuracy
**Scenario**: A customer places an order for a product that costs $100. Later, the product price increases to $120.
**Benefit**: The order history shows the correct $100 price that was charged, not the current $120 price.

### 2. Financial Reporting
**Scenario**: Monthly sales reports need to show revenue based on prices at time of sale.
**Benefit**: Reports use snapshot pricing data, ensuring accurate historical financial analysis.

### 3. Product Lifecycle Tracking
**Scenario**: A product's specifications are updated after several orders have been placed.
**Benefit**: Each order maintains the exact specifications that were available when the customer made their purchase decision.

### 4. Customer Service
**Scenario**: A customer calls about an order placed 6 months ago, but the product details have changed.
**Benefit**: Support can see exactly what the customer ordered, including images and specifications from that time.

### 5. Legal and Compliance
**Scenario**: A dispute arises about product specifications or pricing.
**Benefit**: Complete audit trail with timestamped product snapshots provides legal protection.

### 6. Merchant Analytics
**Scenario**: A merchant wants to analyze how product changes affected sales.
**Benefit**: Can compare current product data with historical snapshot data to measure impact of changes.

## Query Patterns

### Accessing Current vs Historical Data

```typescript
// Get current product data (may have changed)
const currentProduct = await prisma.product.findUnique({
  where: { id: orderItem.productId }
});

// Get product data as it was when ordered (from snapshot)
const historicalProduct = orderItem.productSnapshot;

// Compare pricing changes
const priceChange = currentProduct.price - historicalProduct.price;
```

### Search by Historical Data

```typescript
// Find orders that contained a specific product brand at time of order
const orders = await prisma.order.findMany({
  where: {
    items: {
      some: {
        productBrand: "SpecificBrand"
      }
    }
  }
});

// Find orders with specific product categories at time of order
const categoryOrders = await prisma.order.findMany({
  where: {
    items: {
      some: {
        productCategory: "Electronics"
      }
    }
  }
});
```

### Analytics Queries

```typescript
// Revenue by product brand (using historical data)
const revenueByBrand = await prisma.orderItem.groupBy({
  by: ['productBrand'],
  _sum: {
    totalPrice: true
  },
  where: {
    order: {
      status: 'DELIVERED'
    }
  }
});

// Most ordered products by historical name
const popularProducts = await prisma.orderItem.groupBy({
  by: ['productName', 'productSku'],
  _count: {
    id: true
  },
  orderBy: {
    _count: {
      id: 'desc'
    }
  }
});
```

## Performance Considerations

### 1. Storage Impact
- **JSON Fields**: Product and variant snapshots are stored as JSON, which is efficient in PostgreSQL
- **Denormalized Fields**: Key fields are duplicated for fast queries without JSON parsing
- **Estimated Overhead**: ~2-5KB per order item (depending on product complexity)

### 2. Query Performance
- **Indexed Fields**: `productName`, `productSku`, `productBrand`, `productCategory` should be indexed for fast filtering
- **JSON Queries**: PostgreSQL provides efficient JSON querying capabilities when needed
- **Denormalized Access**: Most common queries use denormalized fields for optimal performance

### 3. Network/Response Size
- **Selective Inclusion**: Snapshot data is only included when specifically requested
- **Compression**: JSON fields compress well during network transmission
- **Pagination**: Large order lists remain performant due to efficient field selection

## Data Consistency and Integrity

### 1. Snapshot Timing
- Snapshots are created **exactly** when the order item is created
- `snapshotCreatedAt` timestamp provides precise audit trail
- No retroactive snapshot updates to maintain integrity

### 2. Custom Product Handling
- Quote-derived items with custom product details are properly captured
- Custom fields take precedence over database lookups
- Consistent snapshot structure regardless of data source

### 3. Error Handling
- If product lookup fails, custom product name is used as fallback
- Missing optional fields default to appropriate null values
- System continues to function even with incomplete product data

## Future Enhancements

### 1. Snapshot Comparison API
```typescript
// Future endpoint to compare current vs historical product data
GET /api/order-fulfillment/order-items/:id/product-changes
{
  "hasChanges": true,
  "changes": {
    "price": {
      "old": 45.99,
      "new": 52.99,
      "changePercent": 15.2
    },
    "description": {
      "old": "Original description...",
      "new": "Updated description...",
      "changed": true
    }
  }
}
```

### 2. Bulk Snapshot Analysis
- Analyze product changes across multiple orders
- Identify trends in pricing, specifications, or availability
- Generate reports on product evolution over time

### 3. Snapshot Versioning
- Track multiple snapshots per product over time
- Enable rollback to previous product states
- Maintain complete product history timeline

### 4. Image Archiving
- Archive product images at time of order
- Ensure historical images remain accessible
- Handle image URL changes or deletions

## Migration Strategy

### For Existing Orders (Retroactive)
Since this is a new feature, existing orders won't have snapshot data. Options include:

1. **No Action**: Leave existing orders without snapshots (recommended for most cases)
2. **Best Effort Snapshot**: Create snapshots using current product data with notation that they're retroactive
3. **Historical Reconstruction**: If product change logs exist, attempt to reconstruct historical states

### Implementation Recommendation
- Deploy the feature for new orders immediately
- Existing orders continue to work without snapshots
- Clearly distinguish between orders with and without snapshot data in the UI

## Testing Strategy

### 1. Unit Tests
- Test snapshot creation for various product types
- Verify custom product handling
- Test error scenarios (missing products, etc.)

### 2. Integration Tests
- Full order creation with snapshot verification
- API response validation
- Database constraint validation

### 3. Performance Tests
- Measure snapshot creation overhead
- Test query performance with snapshot fields
- Validate storage growth patterns

## Summary

The Product Snapshot System provides comprehensive historical product data preservation for Hardware World's B2B e-commerce platform. By automatically capturing complete product and variant information at the time of order, the system ensures:

- **Accurate Order History**: Orders always show what was actually purchased
- **Financial Integrity**: Historical pricing data for accurate reporting
- **Audit Compliance**: Complete audit trails for legal and regulatory requirements
- **Customer Service Excellence**: Support teams have complete historical context
- **Business Intelligence**: Rich data for analyzing product evolution and sales trends

This implementation balances comprehensive data capture with performance efficiency, ensuring that Hardware World maintains complete order accuracy while supporting business growth and compliance requirements.
