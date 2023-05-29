# waar-streamen

A web app to search for movies and series on (mainly flemish/dutch) streaming services supported by a custom backend.
Data returned by the server might not be correct, this is solely because the streaming services don't report the correct data themselves. (f.e.: language is falsely reported as 'en' by GoPlay on dutch programs)

## Supported streaming services

- [x] GoPlay
  - Language is not always (correctly) reported
- [x] VTM GO
  - Language is not always reported
- [x] Streamz
  - Language is not always reported
- [x] VRT MAX
  - Language is never reported
- [ ] NPO Start

## Backend-NestJs (https://nestjs.waar-streamen.nasaj.be/api#/)

The backend is written in TypeScript using the [NestJS](https://nestjs.com/) framework. It also uses caching to reduce the amount of requests to the streaming services. This caching is currently done in-memory and rather naive.
The structure allows for easily changing the caching mechanism to something more robust and/or persistent.
Adding new streaming services is also very easy, just create a new service that implements the `Retriever` interface and add it to the `SearchModule` and the `RetrieverManager`.

You can choose how deep you want the backend to search for data about a program. A variable `fetchDepth` is used to determine this. This variable can have 3 values (`shallow`, `deep` or `full`) which will all yield different data for every streaming platform.
f.e.: `shallow` might only return the title and an image that is not poster size for VTM GO, while `deep` will add a description, language and a poster sized image and maybe some data about available seasons and episodes. `full` should even go deeper and retrieve all available episedes. GoPlay will however contain all data by just using `deep` causse its backend returns more wanted data

The default values for this variable is `shallow` to reduce the load on the server.
Depending on your query this parameter can make a big difference.
Estimates are:
 - `shallow` (~ 250ms) : 1 request per streaming service
 - `deep` (~ 600ms) : possible extra request(s) per program/movies found
 - `full` (> 1s): even more requests per program are possible
   - !! This can take a long time if your query is too broad !!
