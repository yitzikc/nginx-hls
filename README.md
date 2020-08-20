# Nginx HLS

## Description

This project defines a Docker image that runs Nginx with the RTMP module. It can accept
a live video feed via RTMP, and publish it to subscribers using both HLS and RTMP.
3 outgoing video streams are available: _stream1_, _stream2_ and _test_., which can be
mapped to incoming streaming keys. See _Running_ below for more details about the mapping.

Generally Nginx RTMP module doesn't define a top-level m3u8 index file. The Docker image
does supply these files, hardcoded for a stream of 720P with the streaming key named
_test_. In addition, it also provides an HTTP file which plays the video stream.

To publish a video stream, stream 720P with the stream key _test_ to:
_rtmp://\<hostname\>/incoming_

The video routing configuration provided maps the keys _in1_, _in2_ and _test_
to the streams _stream1_, _stream2_ and _test_ respectively.

To view the video stream sent to _in1_ via HLS, point your player to:
_http://\<hostname\>/stream1.m3u8_

Alternatively, open a browser on: _http://\<hostname\>/stream1.html_.

For _in2_ and _test_ replace _stream1.m3u8_ with _stream2.m3u8_ or _test.m3u8_ respectively.



## Running

To run the server in Docker.

* Build the Docker container:

``` bash
docker build -t nginx-hls .
```

Note the Docker hash that is printed at the end of the build, and run as:

* Run the container. To have it listen for HTTP on port 8080, use:

``` bash
docker run -d --rm -p 1935:1935 -p 8080:80 --name nginx-hls nginx-hls
```

Adapt the invocation to match your setup.

To change the routing of streaming keys to output streams, replace
_conf/video-routing.conf_ with your own version. To set different
codecs and data rates, replace metadata in the _m3u8_ files with
_EXT-X-STREAM-INF_ line appropriate values.

## Limitations

* This setup make no attempt so stream the content using multiple bandwidths and resolutions. 
It streams exactly what it is sent by the RTMP publisher. This misses a key feature of HLS.
See the article by Tomo Krajina below for more details about how HLS is built to provide the optimal
experience for the user's bandwidth and screen resolution.

* The codec configuration is hardcoded to `CODECS="avc1.42c00d,mp4a.40.2"`. To change
it, you can customize the _m3u8_ files.

## For Further Reading

* Documentation of the Nginx RTMP module configuration directives:
<https://github.com/arut/nginx-rtmp-module/wiki/Directives>

* A very useful blog post by Tomo Krajina explaining how HLS streaming works
and the file formats involved:
<https://www.toptal.com/apple/introduction-to-http-live-streaming-hls>

* Documentation of the Docker images which server as the basis for this project:
<https://github.com/tiangolo/nginx-rtmp-docker>

## Roadmap

* Make the system more adaptive and flexible. Auto-detect codec
configurations and rates and generate appropriate index files on the fly.
* Execute FFMPEG to down-sample the incoming stream on the fly, and to make
it possible to only subscribe for audio. This example might serve as a starting
point, although it doesn't address streaming.
<https://docs.peer5.com/guides/production-ready-hls-vod/>
