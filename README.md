To Whom It May Concern:

I used the boilerplate app available on the docker website as a starting point. 

[Containerize an application | Docker Documentation](https://docs.docker.com/get-started/02_our_app/)

## Notes

API routing is available in:
```/app/src/index.js```

Routing is available in:
```/app/src/routes```

UI is available in:
```/app/src/static/js/app.js```

Logging is available within the sqlite functions:
```/app/src/persistence/sqlite.js```

I was unable to implement unit tests on this boilerplate, but currently work with Jest to test React code.

Thank you and have a nice day. 

Best regards,
Enrique

# Docker Getting Started Tutorial

This tutorial has been written with the intent of helping folks get up and running
with containers and is designed to work with Docker Desktop. While not going too much 
into depth, it covers the following topics:

- Running your first container
- Building containers
- Learning what containers are running and removing them
- Using volumes to persist data
- Using bind mounts to support development
- Using container networking to support multi-container applications
- Using Docker Compose to simplify the definition and sharing of applications
- Using image layer caching to speed up builds and reduce push/pull size
- Using multi-stage builds to separate build-time and runtime dependencies

## Getting Started

If you wish to run the tutorial, you can use the following command after installing Docker Desktop:

```bash
docker run -d -p 80:80 docker/getting-started
```

Once it has started, you can open your browser to [http://localhost](http://localhost).

## Development

This project has a `docker-compose.yml` file, which will start the mkdocs application on your
local machine and help you see changes instantly.

```bash
docker-compose up
```

## Contributing

If you find typos or other issues with the tutorial, feel free to create a PR and suggest fixes!

If you have ideas on how to make the tutorial better or new content, please open an issue first before working on your idea. While we love input, we want to keep the tutorial  scoped to newcomers.
As such, we may reject ideas for more advanced requests and don't want you to lose any work you might
have done. So, ask first and we'll gladly hear your thoughts!
