FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build --configuration=production

FROM nginx:alpine
COPY --from=0 /app/dist/browser/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
