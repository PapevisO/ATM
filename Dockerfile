FROM node:14-stretch
LABEL maintainer "Oleksandr Papevis <sasha@papevis.com>"

RUN apt-get update
# RUN apt-get -y upgrade
RUN apt-get -y install htop vim mc

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY --from=lusky3/ttyd / /

ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /sbin/tini
RUN chmod +x /sbin/tini

RUN mkdir /app
COPY . /app

WORKDIR /app

# RUN chown -R 1000:1000 /lib

EXPOSE 7681

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["ttyd","zsh"]
