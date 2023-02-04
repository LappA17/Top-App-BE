"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TelegramModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const telegram_constants_1 = require("./telegram.constants");
const telegram_service_1 = require("./telegram.service");
let TelegramModule = TelegramModule_1 = class TelegramModule {
    static forRootAsync(options) {
        const asyncOptions = this.createAsyncOptionsProvider(options);
        return {
            module: TelegramModule_1,
            imports: options.imports,
            providers: [telegram_service_1.TelegramService, asyncOptions],
            exports: [telegram_service_1.TelegramService],
        };
    }
    static createAsyncOptionsProvider(options) {
        return {
            provide: telegram_constants_1.TELEGRAM_MODULE_OPTIONS,
            useFactory: async (...args) => {
                const config = await options.useFactory(...args);
                return config;
            },
            inject: options.inject || [],
        };
    }
};
TelegramModule = TelegramModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], TelegramModule);
exports.TelegramModule = TelegramModule;
//# sourceMappingURL=telegram.module.js.map