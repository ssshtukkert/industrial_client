# FRONT
FROM node:16-alpine
# Установка зависимостей

# RUN mkdir -p /Nevatom_cloud_front/vue/dist/pwa/

WORKDIR /pwa/
# Создание рабочей дериктории 

COPY /dist/pwa/ /pwa/
# Копирование основных файлов

# Для использования в продакшне
# RUN npm install --production


EXPOSE 3001 3080 3081
# Уведомление о порте, который будет прослушивать работающее приложение