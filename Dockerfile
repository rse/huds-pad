
FROM       node:alpine

COPY       ./ /home/huds-pad
WORKDIR    /home/huds-pad

RUN        npm install --production
RUN        npm install http-server -g

CMD        ["http-server"]

EXPOSE     8080

