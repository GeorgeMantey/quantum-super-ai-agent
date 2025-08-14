FROM node:20-alpine
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate && pnpm i --frozen-lockfile && pnpm build
EXPOSE 8080
CMD ["node","dist/index.js"]
