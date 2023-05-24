export const vrtMaxQuery = `query Search($q: String, $mediaType: MediaType, $facets: [SearchFacetInput], $after: ID, $before: ID, $lazyItemCount: Int = 10) {
  uiSearch(input: {q: $q, mediaType: $mediaType, facets: $facets}) {
    ...containerNavigation
  }
}
fragment containerNavigation on ContainerNavigation {
  items {
    title
    components {
      ...paginatedTileListFragment
    }
  }
}
fragment paginatedTileListFragment on PaginatedTileList {
  paginatedItems(first: $lazyItemCount, after: $after, before: $before) {
    edges {
      node {
        ...tileFragment
      }
    }
  }
}
fragment tileFragment on Tile {
  ... on ITile {
    title
    image {
      templateUrl
    }
  }
  ... on ProgramTile {
    description
    link
  }
}`;
