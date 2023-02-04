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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopPageController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const ad_validation_pipe_1 = require("../pipes/ad-validation.pipe");
const create_top_page_dto_1 = require("./dto/create-top-page.dto");
const find_top_page_dto_1 = require("./dto/find-top-page.dto");
const top_page_constants_1 = require("./top-page.constants");
const top_page_service_1 = require("./top-page.service");
let TopPageController = class TopPageController {
    constructor(topPageService) {
        this.topPageService = topPageService;
    }
    async create(dto) {
        return this.topPageService.create(dto);
    }
    async get(id) {
        const page = await this.topPageService.findById(id);
        if (!page) {
            throw new common_1.NotFoundException((0, top_page_constants_1.NOT_FOUND_TOP_PAGE_ERROR)(id));
        }
        return page;
    }
    async getByAlias(alias) {
        const page = await this.topPageService.findByAlias(alias);
        if (!page) {
            throw new common_1.NotFoundException((0, top_page_constants_1.NOT_FOUND_ALIAS_TOP_PAGE_ERROR)(alias));
        }
        return page;
    }
    async delete(id) {
        const detetedPage = await this.topPageService.deleteById(id);
        if (!detetedPage) {
            throw new common_1.NotFoundException((0, top_page_constants_1.NOT_FOUND_TOP_PAGE_ERROR)(id));
        }
    }
    async patch(id, dto) {
        const updatedPage = await this.topPageService.updateById(id, dto);
        if (!updatedPage) {
            throw new common_1.NotFoundException((0, top_page_constants_1.NOT_FOUND_TOP_PAGE_ERROR)(id));
        }
        return updatedPage;
    }
    async find(dto) {
        return await this.topPageService.findByCategory(dto.firstCategory);
    }
    async textSearch(text) {
        const pageByText = await this.topPageService.findByText(text);
        if (!pageByText)
            throw new common_1.NotFoundException((0, top_page_constants_1.NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR)(text));
        return pageByText;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_top_page_dto_1.CreateTopPageDto]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', ad_validation_pipe_1.IdValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('byAlias/:alias'),
    __param(0, (0, common_1.Param)('alias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "getByAlias", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_top_page_dto_1.CreateTopPageDto]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "patch", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('find'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_top_page_dto_1.FindTopPageDto]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "find", null);
__decorate([
    (0, common_1.Get)('textSearch/:text'),
    __param(0, (0, common_1.Param)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopPageController.prototype, "textSearch", null);
TopPageController = __decorate([
    (0, common_1.Controller)('top-page'),
    __metadata("design:paramtypes", [top_page_service_1.TopPageService])
], TopPageController);
exports.TopPageController = TopPageController;
//# sourceMappingURL=top-page.controller.js.map