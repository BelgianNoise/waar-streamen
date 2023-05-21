# waar-streamen

A web app to search for movies and series on (mainly flemish/dutch) streaming services.
Data returned by the server might not be correct, this is solely because the streaming services don't report the correct data themselves. (f.e.: language is falsely reported as 'en' by GoPlay on dutch programs)

## Supported streaming services

- [x] GoPlay
- [ ] VTM GO
- [ ] VRT MAX
- [ ] NPO Start

## Backend

The backend is written in TypeScript using the [NestJS](https://nestjs.com/) framework. It also uses caching to reduce the amount of requests to the streaming services. This caching is currently done in-memory and rather naive.
The structure allows for easyly changing the caching mechanism to something more robust and/or persistent.
Adding new streaming services is also very easy, just create a new service that implements the `Retriever` interface and add it to the `SearchModule` and the `RetrieverManager`.
