# Node Ver 22
FROM node:22

# สร้างโฤล์เดอร์ใน Container
WORKDIR /app

# คักลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอง source code ทั้งหมด
COPY . .

# Build TS เป็น JS
RUN npm run build

# Expose port ที่ server run
EXPOSE 3000

# คำสั่ง RUN SERVER
CMD ["node", "dist/index.js"]