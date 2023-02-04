"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTelegramConfig = void 0;
const getTelegramConfig = (configService) => {
    var _a;
    const token = configService.get('TELEGRAM_TOKEN');
    if (!token) {
        throw new Error('TELEGRAM_TOKEN не задан');
    }
    return {
        token,
        chatId: (_a = configService.get('CHAT_ID')) !== null && _a !== void 0 ? _a : '',
    };
};
exports.getTelegramConfig = getTelegramConfig;
//# sourceMappingURL=telegram.config.js.map