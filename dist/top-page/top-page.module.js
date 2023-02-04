"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopPageModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_typegoose_1 = require("nestjs-typegoose");
const top_page_controller_1 = require("./top-page.controller");
const top_page_model_1 = require("./top-page.model");
const top_page_service_1 = require("./top-page.service");
let TopPageModule = class TopPageModule {
};
TopPageModule = __decorate([
    (0, common_1.Module)({
        controllers: [top_page_controller_1.TopPageController],
        imports: [
            nestjs_typegoose_1.TypegooseModule.forFeature([
                {
                    typegooseClass: top_page_model_1.TopPageModel,
                    schemaOptions: {
                        collection: 'TopPage',
                    },
                },
            ]),
        ],
        providers: [top_page_service_1.TopPageService],
        exports: [top_page_service_1.TopPageService],
    })
], TopPageModule);
exports.TopPageModule = TopPageModule;
//# sourceMappingURL=top-page.module.js.map