FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate && pnpm i --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate   && pnpm i --frozen-lockfile && pnpm build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .
EXPOSE 3000
CMD ["pnpm","start"]
