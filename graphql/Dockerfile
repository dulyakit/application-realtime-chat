# ใช้ Node.js image เป็น base image
FROM node:latest

# สร้าง directory สำหรับ application
WORKDIR /usr/src/app

# Install app dependencies
# ใช้ wildcard เพื่อให้แน่ใจว่าทั้ง package.json และ package-lock.json (หรือ yarn.lock) ถูกคัดลอก
COPY package*.json ./
COPY yarn.lock ./

# ถ้าใช้ npm แทน yarn, ใช้:
# RUN npm install
# ถ้าใช้ yarn:
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Expose port ที่ application ใช้ (port ที่ app ของคุณ listen อยู่ข้างใน container)
EXPOSE 8080

# Define the command to run your app
CMD [ "yarn", "run", "dev" ]
