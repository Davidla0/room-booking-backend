"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}
const adapter = new adapter_pg_1.PrismaPg({
    connectionString,
});
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        adapter,
        log: ['query', 'error', 'warn'],
    });
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = exports.prisma;
}
