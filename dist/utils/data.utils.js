"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOverlapping = isOverlapping;
function isOverlapping(existingStart, existingEnd, requestedStart, requestedEnd) {
    return existingStart < requestedEnd && existingEnd > requestedStart;
}
