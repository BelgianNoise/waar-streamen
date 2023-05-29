<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

The Nestjs powered backend supporting the waar-streamen web app.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
$ pnpm run start
$ pnpm run start:dev
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test
# e2e tests
$ pnpm run test:e2e
# test coverage
$ pnpm run test:cov
```

---

## Integrated streaming platforms

### GoPlay :
```http
POST https://api.goplay.be/search

content-type: application/json;charset=UTF-8

{query: "blind", page: 0, mode: "programs"}
```

### VTM GO :
```http
GET https://vtm.be/vtmgo/zoeken?query=blind

cookie: <cookie>
```

### Streamz :
```http
GET https://www.streamz.be/streamz/zoeken?query=blind

cookie: <cookie>
```

### VRT MAX :
```http
POST https://www.vrt.be/vrtnu-api/graphql/v1

content-type: application/json

{
  operationName: 'Search',
  variables: {
    q: 'blind',
    mediaType: 'all',
    facets: null,
  },
  query: <vrtMaxQuery>,
}
```

### NPO Start :
```http
GET https://www.npostart.nl/search?query=blind
```
