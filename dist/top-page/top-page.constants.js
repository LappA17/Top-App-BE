"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR = exports.NOT_FOUND_ALIAS_TOP_PAGE_ERROR = exports.NOT_FOUND_TOP_PAGE_ERROR = void 0;
const NOT_FOUND_TOP_PAGE_ERROR = (id) => `Страница с id ${id} не найдена`;
exports.NOT_FOUND_TOP_PAGE_ERROR = NOT_FOUND_TOP_PAGE_ERROR;
const NOT_FOUND_ALIAS_TOP_PAGE_ERROR = (alias) => `Страница с alias ${alias} не найдена`;
exports.NOT_FOUND_ALIAS_TOP_PAGE_ERROR = NOT_FOUND_ALIAS_TOP_PAGE_ERROR;
const NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR = (text) => `Страница с заголовком или текстом ${text} не найдена`;
exports.NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR = NOT_FOUND_TOP_PAGE_BY_TEXT_ERROR;
//# sourceMappingURL=top-page.constants.js.map