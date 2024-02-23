"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogClass = void 0;
class BlogClass {
    constructor(name, description, websiteUrl) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = new Date().toISOString();
        this.isMembership = false;
    }
}
exports.BlogClass = BlogClass;
//# sourceMappingURL=blogs-classes.js.map