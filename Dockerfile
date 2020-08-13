FROM tiangolo/nginx-rtmp

COPY conf/*.conf /etc/nginx/
COPY hls/*.html hls/*.js hls/*.m3u8 /srv/
