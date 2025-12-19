"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                displayName: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                avatar: true,
                isActive: true,
                emailVerified: true,
                verifyToken: true,
                resetToken: true,
                resetTokenExpiry: true,
                provider: true,
                providerId: true,
                refreshToken: true,
                jobTitle: true,
                department: true,
                approvalLimit: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                companies: {
                    include: {
                        company: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
                merchants: {
                    include: {
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user)
            return null;
        return this.mapToUserEntity(user);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                password: true,
                displayName: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                avatar: true,
                isActive: true,
                emailVerified: true,
                verifyToken: true,
                resetToken: true,
                resetTokenExpiry: true,
                provider: true,
                providerId: true,
                refreshToken: true,
                jobTitle: true,
                department: true,
                approvalLimit: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                companies: {
                    include: {
                        company: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                industry: true,
                            },
                        },
                    },
                },
                merchants: {
                    include: {
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                businessType: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user)
            return null;
        return this.mapToUserEntity(user);
    }
    async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                displayName: userData.displayName,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                emailVerified: userData.emailVerified || false,
                jobTitle: userData.jobTitle,
                department: userData.department,
                approvalLimit: userData.approvalLimit,
                roles: userData.roles
                    ? {
                        connect: userData.roles.map((roleId) => ({ id: roleId })),
                    }
                    : undefined,
            },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                companies: {
                    include: {
                        company: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
                merchants: {
                    include: {
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        return this.mapToUserEntity(user);
    }
    async update(id, userData) {
        const updateData = { ...userData };
        if (userData.password) {
            updateData.password = await bcrypt.hash(userData.password, 10);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                companies: {
                    include: {
                        company: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
                merchants: {
                    include: {
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        return this.mapToUserEntity(user);
    }
    async updateRoles(userId, roleIds) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                roles: {
                    set: roleIds.map((id) => ({ id })),
                },
            },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                companies: {
                    include: {
                        company: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
                merchants: {
                    include: {
                        merchant: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        return this.mapToUserEntity(user);
    }
    async findByResetToken(resetToken) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });
        if (!user)
            return null;
        return this.mapToUserEntity(user);
    }
    async findByVerifyToken(verifyToken) {
        const user = await this.prisma.user.findFirst({
            where: { verifyToken },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });
        if (!user)
            return null;
        return this.mapToUserEntity(user);
    }
    async getAllUsers(params) {
        const { page = 1, limit = 20, search, status, role } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { displayName: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status && status !== 'all') {
            if (status === 'active') {
                where.isActive = true;
            }
            else if (status === 'inactive') {
                where.isActive = false;
            }
        }
        if (role && role !== 'all') {
            where.roles = {
                some: {
                    name: role,
                },
            };
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    displayName: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    avatar: true,
                    isActive: true,
                    emailVerified: true,
                    jobTitle: true,
                    department: true,
                    approvalLimit: true,
                    createdAt: true,
                    updatedAt: true,
                    roles: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                    companies: {
                        include: {
                            company: {
                                select: {
                                    name: true,
                                    displayName: true,
                                },
                            },
                        },
                    },
                    merchants: {
                        include: {
                            merchant: {
                                select: {
                                    name: true,
                                    displayName: true,
                                },
                            },
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({
                where,
            }),
        ]);
        return {
            users: users.map((user) => this.mapToUserEntity(user)),
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async deleteUser(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
    async getAllRoles() {
        const roles = await this.prisma.role.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return {
            roles,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }
    async verifyEmail(verifyToken) {
        const foundUser = await this.prisma.user.findFirst({
            where: { verifyToken },
        });
        if (!foundUser) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        const user = await this.prisma.user.update({
            where: { id: foundUser.id },
            data: {
                emailVerified: true,
                verifyToken: null,
            },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });
        return this.mapToUserEntity(user);
    }
    async createPasswordResetToken(email) {
        const resetToken = Math.random().toString(36).substr(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        const foundUser = await this.prisma.user.findFirst({
            where: { email },
        });
        if (!foundUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const user = await this.prisma.user.update({
            where: { id: foundUser.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });
        return { resetToken, user: this.mapToUserEntity(user) };
    }
    async resetPassword(resetToken, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const foundUser = await this.prisma.user.findFirst({
            where: { resetToken },
        });
        if (!foundUser) {
            throw new common_1.NotFoundException('Invalid reset token');
        }
        const user = await this.prisma.user.update({
            where: { id: foundUser.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
            include: {
                roles: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });
        return this.mapToUserEntity(user);
    }
    async updateUserRoles(userId, roleIds) {
        return this.updateRoles(userId, roleIds);
    }
    async updateProfile(userId, profileData) {
        return this.update(userId, profileData);
    }
    mapToUserEntity(user) {
        return new user_entity_1.User({
            id: user.id,
            email: user.email,
            password: user.password,
            displayName: user.displayName,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            verifyToken: user.verifyToken,
            resetToken: user.resetToken,
            resetTokenExpiry: user.resetTokenExpiry,
            provider: user.provider,
            providerId: user.providerId,
            refreshToken: user.refreshToken,
            jobTitle: user.jobTitle,
            department: user.department,
            approvalLimit: user.approvalLimit,
            idType: user.idType,
            idValue: user.idValue,
            roles: user.roles || [],
            companies: user.companies?.map((uc) => ({
                id: uc.company.id,
                name: uc.company.name,
                displayName: uc.company.displayName,
                role: uc.role,
            })) || [],
            merchants: user.merchants?.map((um) => ({
                id: um.merchant.id,
                name: um.merchant.name,
                displayName: um.merchant.displayName,
                role: um.role,
            })) || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map