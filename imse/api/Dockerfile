FROM node:18

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN sed -i 's/\r$//' ./run.sh  && chmod +x ./run.sh
CMD [ "sh", "-c", "./run.sh"]