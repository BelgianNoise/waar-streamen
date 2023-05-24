export const vrtMaxSearchQuery = `
query Search($q: String, $mediaType: MediaType, $facets: [SearchFacetInput], $after: ID, $before: ID, $lazyItemCount: Int = 10) {
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
}
`;

export const vrtMaxDetailsQuery = `
query VideoProgramPage($pageId: ID!, $lazyItemCount: Int = 10, $after: ID, $before: ID) {
  page(id: $pageId) {
    ... on ProgramPage {
      components {
        ... on ContainerNavigation {
          items {
            title
            components {
              ... on IComponent {
                ... on ContainerNavigation {
                  items {
                    title
                    components {
                      ... on Component {
                        ... on PaginatedTileList {
                          ...paginatedTileListFragment
                        }
                        ... on LazyTileList {
                          listId
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
fragment paginatedTileListFragment on PaginatedTileList {
  listId
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
    primaryMeta {
      value
    }
  }
}
`;

export const vrtMaxListQuery = `
query ProgramSeasonEpisodeList($listId: ID!, $sort: SortInput, $lazyItemCount: Int = 20, $after: ID, $before: ID) {
  list(listId: $listId, sort: $sort) {
    ... on PaginatedTileList {
      ...paginatedTileListFragment
    }
    ... on StaticTileList {
      ...staticTileListFragment
    }
  }
}
fragment staticTileListFragment on StaticTileList {
  title
  items {
    ...tileFragment
  }
}
fragment tileFragment on Tile {
  ... on ITile {
    title
    primaryMeta {
      value
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
`;
