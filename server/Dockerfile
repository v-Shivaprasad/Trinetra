From node:20

Workdir /server

copy package.json ./



run npm install -g pnpm && pnpm install

copy . . 

Expose 3001

CMD ["node","server.js"]
