export const vrtMaxQuery = `query Search($q: String, $mediaType: MediaType, $facets: [SearchFacetInput], $after: ID, $before: ID, $lazyItemCount: Int = 10) {
  uiSearch(input: {q: $q, mediaType: $mediaType, facets: $facets}) {
    __typename
    ... on IIdentifiable {
      objectId
      __typename
    }
    ... on IComponent {
      componentType
      __typename
    }
    ...noContentFragment
    ...containerNavigation
    ...buttonFragment
    ...banner
    ...containerNavigation
    ...noContentFragment
    ...paginatedTileListFragment
    ...staticTileListFragment
    ...textFragment
  }
}
fragment containerNavigation on ContainerNavigation {
  id: objectId
  objectId
  navigationType
  items {
    id: objectId
    objectId
    active
    title
    analytics {
      ... on PageAnalyticsData {
        pageContentbrand
        pageName
        __typename
      }
      __typename
    }
    mediaType
    disabled
    components {
      __typename
      ... on IIdentifiable {
        objectId
        __typename
      }
      ... on IComponent {
        componentType
        __typename
      }
      ...paginatedTileListFragment
      ...noContentFragment
      ... on Text {
        id: objectId
        title
        html
        __typename
      }
    }
    __typename
  }
}
fragment actionItem on ActionItem {
  __typename
  id: objectId
  accessibilityLabel
  action {
    ...action
    __typename
  }
  active
  analytics {
    __typename
    eventId
    interaction
    interactionDetail
    pageProgrambrand
  }
  icon
  iconPosition
  mode
  objectId
  title
}
fragment action on Action {
  __typename
  ... on FavoriteAction {
    __typename
    favorite
    id
    programUrl
    programWhatsonId
    title
  }
  ... on ListDeleteAction {
    __typename
    listName
    id
    listId
    title
  }
  ... on ListTileDeletedAction {
    __typename
    listName
    id
    listId
  }
  ... on PodcastEpisodeListenAction {
    id: audioId
    podcastEpisodeLink
    resumePointProgress
    resumePointTotal
    completed
    __typename
  }
  ... on EpisodeWatchAction {
    id: videoId
    videoUrl
    resumePointProgress
    resumePointTotal
    completed
    __typename
  }
  ... on LinkAction {
    id: linkId
    link
    linkType
    openExternally
    passUserIdentity
    __typename
  }
  ... on ShareAction {
    url
    __typename
  }
  ... on SwitchTabAction {
    referencedTabId
    mediaType
    __typename
  }
  ... on SearchAction {
    facets {
      name
      values
      __typename
    }
    mediaType
    navigationType
    q
    __typename
  }
  ... on RadioEpisodeListenAction {
    streamId
    pageLink
    startDate
    __typename
  }
  ... on LiveListenAction {
    streamId
    livestreamPageLink
    startDate
    endDate
    __typename
  }
  ... on LiveWatchAction {
    streamId
    livestreamPageLink
    __typename
  }
}
fragment banner on Banner {
  __typename
  id: objectId
  objectId
  brand
  componentType
  richDescription {
    __typename
    text
  }
  ctaText
  image {
    id: objectId
    templateUrl
    alt
    focalPoint
    __typename
  }
  title
  compactLayout
  textTheme
  backgroundColor
  style
  action {
    ...action
    __typename
  }
}
fragment buttonFragment on Button {
  action {
    ...action
    __typename
  }
  componentType
  icon
  iconPosition
  mode
  objectId
  title
  ...componentTrackingDataFragment
}
fragment componentTrackingDataFragment on IComponent {
  trackingData {
    data
    perTrigger {
      trigger
      data
      template {
        id
        __typename
      }
      __typename
    }
    __typename
  }
}
fragment noContentFragment on NoContent {
  __typename
  id: objectId
  objectId
  componentType
  title
  text
  noContentType
  actionItems {
    ...actionItem
    __typename
  }
}
fragment paginatedTileListFragment on PaginatedTileList {
  __typename
  id: objectId
  objectId
  listId
  actionItems {
    ...actionItem
    __typename
  }
  bannerSize
  componentType
  displayType
  expires
  tileVariant
  header {
    action {
      ...action
      __typename
    }
    brand
    brandLogos {
      height
      mono
      primary
      type
      width
      __typename
    }
    ctaText
    description
    image {
      ...imageFragment
      __typename
    }
    type
    compactLayout
    backgroundColor
    textTheme
    __typename
  }
  paginatedItems(first: $lazyItemCount, after: $after, before: $before) {
    __typename
    edges {
      __typename
      cursor
      node {
        __typename
        ...tileFragment
      }
    }
    pageInfo {
      __typename
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
  sort {
    icon
    order
    title
    __typename
  }
  tileContentType
  tileOrientation
  title
  ... on IComponent {
    ...componentTrackingDataFragment
    __typename
  }
}
fragment imageFragment on Image {
  id: objectId
  alt
  title
  focalPoint
  objectId
  templateUrl
}
fragment tileFragment on Tile {
  ... on IIdentifiable {
    __typename
    objectId
  }
  ... on IComponent {
    title
    componentType
    ...componentTrackingDataFragment
    __typename
  }
  ... on ITile {
    title
    action {
      ...action
      __typename
    }
    image {
      ...imageFragment
      __typename
    }
    primaryMeta {
      ...metaFragment
      __typename
    }
    secondaryMeta {
      ...metaFragment
      __typename
    }
    tertiaryMeta {
      ...metaFragment
      __typename
    }
    indexMeta {
      __typename
      type
      value
    }
    statusMeta {
      __typename
      type
      value
    }
    __typename
  }
  ... on ContentTile {
    id
    title
    brand
    brandLogos {
      height
      mono
      primary
      type
      width
      __typename
    }
    __typename
  }
  ... on BannerTile {
    id
    compactLayout
    backgroundColor
    textTheme
    active
    brand
    brandLogos {
      height
      mono
      primary
      type
      width
      __typename
    }
    ctaText
    description
    passUserIdentity
    __typename
  }
  ... on EpisodeTile {
    id
    description
    formattedDuration
    active
    available
    label
    chapterStart
    actionItems {
      ...actionItem
      __typename
    }
    playAction: watchAction {
      pageUrl: videoUrl
      resumePointProgress
      resumePointTotal
      completed
      __typename
    }
    episode {
      __typename
      id
      program {
        __typename
        id
        link
      }
    }
    epgDuration
    __typename
  }
  ... on PodcastEpisodeTile {
    id
    description
    formattedDuration
    active
    available
    programLink: podcastEpisode {
      id
      podcastProgram {
        id
        link
        __typename
      }
      __typename
    }
    playAction: listenAction {
      pageUrl: podcastEpisodeLink
      resumePointProgress
      resumePointTotal
      completed
      __typename
    }
    actionItems {
      ...actionItem
      __typename
    }
    __typename
  }
  ... on PodcastProgramTile {
    id
    link
    description
    actionItems {
      ...actionItem
      __typename
    }
    __typename
  }
  ... on ProgramTile {
    id
    description
    link
    actionItems {
      ...actionItem
      __typename
    }
    __typename
  }
  ... on AudioLivestreamTile {
    id
    description
    active
    brand
    brandsLogos {
      brand
      brandTitle
      logos {
        mono
        primary
        type
        height
        width
        __typename
      }
      __typename
    }
    __typename
  }
  ... on LivestreamTile {
    id
    active
    description
    __typename
  }
  ... on ButtonTile {
    title
    icon
    iconPosition
    mode
    __typename
  }
  ... on RadioEpisodeTile {
    action {
      ...action
      __typename
    }
    actionItems {
      ...actionItem
      __typename
    }
    active
    label
    available
    epgDuration
    componentType
    description
    formattedDuration
    id: objectId
    image {
      ...imageFragment
      __typename
    }
    objectId
    primaryMeta {
      ...metaFragment
      __typename
    }
    thumbnailMeta {
      ...metaFragment
      __typename
    }
    title
    ...componentTrackingDataFragment
    __typename
  }
  ... on SongTile {
    id
    title
    description
    startDate
    formattedStartDate
    endDate
    __typename
  }
  ... on RadioProgramTile {
    id
    __typename
  }
}
fragment metaFragment on MetaDataItem {
  __typename
  type
  value
  shortValue
  longValue
}
fragment staticTileListFragment on StaticTileList {
  __typename
  id: objectId
  objectId
  listId
  title
  componentType
  tileContentType
  tileOrientation
  displayType
  expires
  tileVariant
  sort {
    icon
    order
    title
    __typename
  }
  actionItems {
    ...actionItem
    __typename
  }
  header {
    action {
      ...action
      __typename
    }
    brand
    brandLogos {
      height
      mono
      primary
      type
      width
      __typename
    }
    ctaText
    description
    image {
      ...imageFragment
      __typename
    }
    type
    compactLayout
    backgroundColor
    textTheme
    __typename
  }
  bannerSize
  items {
    ...tileFragment
    __typename
  }
  ... on IComponent {
    ...componentTrackingDataFragment
    __typename
  }
}
fragment textFragment on Text {
  id: objectId
  html
}`;
