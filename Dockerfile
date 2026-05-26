FROM node:18-alpine

WORKDIR /app

# 只复制运行所需文件
COPY package.json ./
COPY src/ ./src/

# 将 entrypoint 脚本复制进去并设置可执行
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 设置时区（默认上海）
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

ENV CHECK_TIME=08:00

ENTRYPOINT ["/entrypoint.sh"]
