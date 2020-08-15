FROM tiangolo/nginx-rtmp

ADD conf/ /etc/nginx/
VOLUME /etc/nginx/dynamic
COPY hls/*.html hls/*.js hls/*.m3u8 /srv/
