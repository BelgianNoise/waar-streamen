import { loading } from "../../routes/loading-store";
import { searchResults } from "../../routes/search-results-store";
import { env } from "$env/dynamic/public";

export const doGetSearchResults = async (
  searchTerm: string,
  options?: {
    fetchDepth?: 'full' | 'deep' | 'shallow';
    exactMatch?: boolean;
  },
) => {
  loading.update(() => true);

  try {
    const res = await fetch(
      `${env.PUBLIC_API_HOST}/search/body/full`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm,
          fetchDepth: options?.fetchDepth || 'full',
        }),
        method: 'POST',
      }
    );
  
    const json = await res.json();

    if (json.error) throw new Error();
    if (!Array.isArray(json)) throw new Error();
    
    const toAdd: any[] = [];
    if (options?.exactMatch) {
      const transformedSearchTerm = searchTerm
        .trim()
        .toLowerCase()
        .replace(/[-_]/gim, ' ')
        .replace(/'/gim, '')
        .replace(/\s+/gim, ' ');
      const filtered = json.filter((i) => i.title
        .trim()
        .toLowerCase()
        .replace(/[-_]/gim, ' ')
        .replace(/'/gim, '')
        .replace(/\s+/gim, ' ')
        .includes(transformedSearchTerm));
      toAdd.push(...filtered);
    } else {
      toAdd.push(...json);
    }
    searchResults.update(() => toAdd);
  } catch {
    searchResults.update(() => []);
  } finally {
    loading.update(() => false);
  }
};
