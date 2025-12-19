import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllRoles(): Promise<{
        roles: {
            description: string | null;
            id: string;
            name: string;
        }[];
    }>;
    getAllUsers(page?: string, limit?: string, search?: string, status?: string, role?: string): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<User>;
    updateUserRoles(userId: string, body: {
        roles: string[];
    }, req: any): Promise<User>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<User>;
}
