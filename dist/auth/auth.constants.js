"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRONG_PASSWORD_ERROR = exports.USER_NOT_FOUND_ERROR = exports.ALREADY_REGISTERED_ERROR = void 0;
exports.ALREADY_REGISTERED_ERROR = 'Такой пользователь уже существует';
const USER_NOT_FOUND_ERROR = (email) => `Пользователь ${email} не найден`;
exports.USER_NOT_FOUND_ERROR = USER_NOT_FOUND_ERROR;
exports.WRONG_PASSWORD_ERROR = 'Неверный пароль';
//# sourceMappingURL=auth.constants.js.map