import { OrderFulfillmentService } from './order-fulfillment.service';
import { CreateOrderDto, UpdateOrderDto, UploadPaymentProofDto, OrderFilterDto, OrderResponseDto, OrderListResponseDto } from './dto/order.dto';
import { CreateFulfillmentDto, AssignFulfillmentDto, FulfillmentResponseDto } from './dto/fulfillment.dto';
import { CreateShipmentDto, UpdateShipmentDto, ShipmentResponseDto } from './dto/shipping.dto';
import { CreateInvoiceDto, InvoiceResponseDto } from './dto/invoice.dto';
export declare class OrderFulfillmentController {
    private readonly orderFulfillmentService;
    constructor(orderFulfillmentService: OrderFulfillmentService);
    createOrder(createOrderDto: CreateOrderDto, req: any): Promise<OrderResponseDto>;
    listOrders(filterDto: OrderFilterDto, req: any): Promise<OrderListResponseDto>;
    getOrderById(id: string, req: any): Promise<OrderResponseDto>;
    updateOrder(id: string, updateOrderDto: UpdateOrderDto, req: any): Promise<OrderResponseDto>;
    uploadPaymentProof(id: string, dto: UploadPaymentProofDto, req: any): Promise<OrderResponseDto>;
    confirmOrder(id: string, req: any): Promise<OrderResponseDto>;
    cancelOrder(id: string, reason: string, req: any): Promise<OrderResponseDto>;
    createFulfillment(createFulfillmentDto: CreateFulfillmentDto, req: any): Promise<FulfillmentResponseDto>;
    assignFulfillment(id: string, assignDto: AssignFulfillmentDto, req: any): Promise<FulfillmentResponseDto>;
    startFulfillment(id: string, req: any): Promise<FulfillmentResponseDto>;
    createShipment(createShipmentDto: CreateShipmentDto, req: any): Promise<ShipmentResponseDto>;
    markShipmentShipped(id: string, trackingNumber: string, req: any): Promise<ShipmentResponseDto>;
    updateShipment(id: string, updateShipmentDto: UpdateShipmentDto, req: any): Promise<ShipmentResponseDto>;
    createInvoice(createInvoiceDto: CreateInvoiceDto, req: any): Promise<InvoiceResponseDto>;
    healthCheck(): Promise<{
        status: string;
        module: string;
        timestamp: string;
        features: string[];
    }>;
}
