# Nginx HLS

## Description

This project defines a Docker image that runs Nginx with the RTMP module. It can accept
a live video feed via RTMP, and publish it to subscribers using both HLS and RTMP.

Generally Nginx RTMP module doesn't define a top-level m3u8 index file. The Docker image
does supply these files, hardcoded for a stream of 720P with the streaming key named
_test_. In addition, it also provides an HTTP file which plays the video stream.

To play that video stream, stream 720P with the stream key _test_ to:
_rtmp://\<hostname\>/live_

To view the video stream via HLS, point your player to:
_http://\<hostname\>/test.m3u8_

Alternatively, open a browser on: _http://\<hostname\>/test.html_.

## Running

To run the server in Docker.

* Build the Docker container:

``` bash
docker build -t nginx-rtmp .
```

Note the Docker hash that is printed at the end of the build, and run as:

* Run the container. To have it listen for HTTP on port 8080, use:

``` bash
docker run -d --rm -p 1935:1935 -p 8080:80 --name nginx-rtmp nginx-rtmp
```

Adapt the invocation to match your setup.

## Limitations

* This setup make no attempt so stream the content using multiple bandwidths and resolutions. 
It streams exactly what it is sent by the RTMP publisher. This misses a key feature of HLS.
See the article by Tomo Krajina below for more details about how HLS is built to provide the optimal
experience for the user's bandwidth and screen resolution.

* The full index structure is only available in a specific, hardcoded configuration. Arbitrary
stream keys can be used, but no master index will be generated.

## For Further Reading

* Documentation of the Nginx RTMP module configuration directives:
<https://github.com/arut/nginx-rtmp-module/wiki/Directives>

* A very useful blog post by Tomo Krajina explaining how HLS streaming works
and the file formats involved:
<https://www.toptal.com/apple/introduction-to-http-live-streaming-hls>

* Documentation of the Docker images which server as the basis for this project:
<https://github.com/tiangolo/nginx-rtmp-docker>

## Roadmap

* Generate the master index file and the HTML file to invoke the player on the fly
whenever a new publisher joins with a stream key. This can be accomplished by
using the *exec_publish* and *exec_publish_done* to run a script whenever
a publisher joins or leaves, which would generate the files dynamically
when the publisher joins and delete them when they leave. See example here:
<http://nginx-rtmp.blogspot.com/2012/09/>
* Execute FFMPEG to down-sample the incoming stream on the fly, and to make
it possible to only subscribe for audio. This example might serve as a starting
point, although it doesn't address streaming.
<https://docs.peer5.com/guides/production-ready-hls-vod/>
