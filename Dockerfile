# build stage
FROM node:16.18.0 as build-stage

# 创建一个工作目录
WORKDIR /app

# 复制符合.dockerignore规则的文件
COPY . .

# 安装依赖
RUN npm install cnpm -g --no-progress --registry=https://registry.npm.taobao.org

RUN cnpm install --no-progress

# 构建
RUN cnpm run build:prod

# production stage
# 使用nginx镜像
FROM nginx:stable-alpine as production-stage

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/default.conf /etc/nginx/conf.d/

# 使用--from把上面产生的静态文件复制到nginx的运行目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# nginx容器内部暴露的端口
EXPOSE 11000

# 运行的命令
CMD ["nginx", "-g", "daemon off;"]