import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all customers with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
    @ApiQuery({ name: 'appId', required: false, type: String, description: 'App ID filter' })
    @ApiResponse({ status: 200, description: 'List of customers' })
    async getAllCustomers(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
        @Query('search') search?: string,
        @Query('appId') appId?: string,
    ) {
        return await this.customersService.getAllCustomers({
            page: Number(page),
            limit: Number(limit),
            search,
            appId,
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get customer by ID' })
    @ApiResponse({ status: 200, description: 'Customer details' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    async getCustomerById(@Param('id') id: string) {
        return await this.customersService.getCustomerById(id);
    }

    @Get(':id/subscriptions')
    @ApiOperation({ summary: 'Get customer subscriptions' })
    @ApiResponse({ status: 200, description: 'Customer subscriptions' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    async getCustomerSubscriptions(@Param('id') id: string) {
        return await this.customersService.getCustomerSubscriptions(id);
    }
} 