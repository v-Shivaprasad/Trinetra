FROM node:18-alpine

WORKDIR /vite-project

COPY package*.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

COPY . .


EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
