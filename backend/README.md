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
Requires cookie to not be lead to the home page. Cookie is currently hardcoded (not sure if that will keep working), def room for improvement.

### Streamz :
```http
GET https://www.streamz.be/streamz/zoeken?query=blind

cookie: <cookie>
```

### VRT MAX :
```http
POST https://www.vrt.be/vrtnu-api/graphql/v1

content-type: application/json

{"query":"query Search($q: String, $mediaType: MediaType, $facets: [SearchFacetInput], $after: ID, $before: ID, $lazyItemCount: Int = 10) {\n  uiSearch(input: {q: $q, mediaType: $mediaType, facets: $facets}) {\n    __typename\n    ... on IIdentifiable {\n      objectId\n      __typename\n    }\n    ... on IComponent {\n      componentType\n      __typename\n    }\n    ...noContentFragment\n    ...containerNavigation\n    ...buttonFragment\n    ...banner\n    ...containerNavigation\n    ...noContentFragment\n    ...paginatedTileListFragment\n    ...staticTileListFragment\n    ...textFragment\n  }\n}\nfragment containerNavigation on ContainerNavigation {\n  id: objectId\n  objectId\n  navigationType\n  items {\n    id: objectId\n    objectId\n    active\n    title\n    analytics {\n      ... on PageAnalyticsData {\n        pageContentbrand\n        pageName\n        __typename\n      }\n      __typename\n    }\n    mediaType\n    disabled\n    components {\n      __typename\n      ... on IIdentifiable {\n        objectId\n        __typename\n      }\n      ... on IComponent {\n        componentType\n        __typename\n      }\n      ...paginatedTileListFragment\n      ...noContentFragment\n      ... on Text {\n        id: objectId\n        title\n        html\n        __typename\n      }\n    }\n    __typename\n  }\n}\nfragment actionItem on ActionItem {\n  __typename\n  id: objectId\n  accessibilityLabel\n  action {\n    ...action\n    __typename\n  }\n  active\n  analytics {\n    __typename\n    eventId\n    interaction\n    interactionDetail\n    pageProgrambrand\n  }\n  icon\n  iconPosition\n  mode\n  objectId\n  title\n}\nfragment action on Action {\n  __typename\n  ... on FavoriteAction {\n    __typename\n    favorite\n    id\n    programUrl\n    programWhatsonId\n    title\n  }\n  ... on ListDeleteAction {\n    __typename\n    listName\n    id\n    listId\n    title\n  }\n  ... on ListTileDeletedAction {\n    __typename\n    listName\n    id\n    listId\n  }\n  ... on PodcastEpisodeListenAction {\n    id: audioId\n    podcastEpisodeLink\n    resumePointProgress\n    resumePointTotal\n    completed\n    __typename\n  }\n  ... on EpisodeWatchAction {\n    id: videoId\n    videoUrl\n    resumePointProgress\n    resumePointTotal\n    completed\n    __typename\n  }\n  ... on LinkAction {\n    id: linkId\n    link\n    linkType\n    openExternally\n    passUserIdentity\n    __typename\n  }\n  ... on ShareAction {\n    url\n    __typename\n  }\n  ... on SwitchTabAction {\n    referencedTabId\n    mediaType\n    __typename\n  }\n  ... on SearchAction {\n    facets {\n      name\n      values\n      __typename\n    }\n    mediaType\n    navigationType\n    q\n    __typename\n  }\n  ... on RadioEpisodeListenAction {\n    streamId\n    pageLink\n    startDate\n    __typename\n  }\n  ... on LiveListenAction {\n    streamId\n    livestreamPageLink\n    startDate\n    endDate\n    __typename\n  }\n  ... on LiveWatchAction {\n    streamId\n    livestreamPShow more
```

### NPO Start :
```http
GET https://www.npostart.nl/search?query=blind
```
