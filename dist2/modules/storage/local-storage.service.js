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
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
const util = require("util");
const crypto = require("crypto");
const multer = require("multer");
const abstract_storage_service_1 = require("./abstract-storage.service");
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
let LocalStorageService = class LocalStorageService extends abstract_storage_service_1.AbstractStorageService {
    constructor(configService) {
        super();
        this.configService = configService;
        this.baseUploadPath = configService.get('UPLOAD_PATH', 'uploads');
        this.baseUrl = configService.get('BASE_URL', 'http://localhost:3000');
        if (!fs.existsSync(this.baseUploadPath)) {
            fs.mkdirSync(this.baseUploadPath, { recursive: true });
        }
    }
    getUploadMiddleware(options) {
        const destination = options?.destination || this.baseUploadPath;
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, destination);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, uniqueSuffix + ext);
            },
        });
        return multer({ storage });
    }
    async uploadFile(file, options) {
        const uploadPath = options?.destination || this.baseUploadPath;
        if (!fs.existsSync(uploadPath)) {
            await mkdir(uploadPath, { recursive: true });
        }
        const fileName = this.generateFileName(file.originalname);
        const filePath = path.join(uploadPath, fileName);
        await writeFile(filePath, file.buffer);
        const relativePath = path
            .relative(process.cwd(), filePath)
            .replace(/\\/g, '/');
        return {
            filename: fileName,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `${this.baseUrl}/${relativePath}`,
        };
    }
    async uploadFiles(files, options) {
        return Promise.all(files.map((file) => this.uploadFile(file, options)));
    }
    async getFile(fileKey) {
        const filePath = path.join(this.baseUploadPath, fileKey);
        const buffer = await readFile(filePath);
        const stats = fs.statSync(filePath);
        return {
            buffer,
            mimetype: this.getMimeType(filePath),
            originalname: fileKey,
            size: stats.size,
        };
    }
    async getFileUrl(fileKey) {
        const relativePath = path
            .join(this.baseUploadPath, fileKey)
            .replace(/\\/g, '/');
        return `${this.baseUrl}/${relativePath}`;
    }
    async deleteFile(fileKey) {
        try {
            const filePath = path.join(this.baseUploadPath, fileKey);
            await unlink(filePath);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    generateFileName(originalname) {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(originalname);
        return `${timestamp}-${randomString}${ext}`;
    }
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.zip': 'application/zip',
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map