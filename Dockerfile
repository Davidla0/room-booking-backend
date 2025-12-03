# backend/Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@room-booking-postgres:5432/room_booking?schema=public"

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/index.js"]
