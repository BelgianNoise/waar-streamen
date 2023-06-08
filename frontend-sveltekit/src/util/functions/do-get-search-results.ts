import { loading } from "../../routes/loading-store";
import { searchResults } from "../../routes/search-results-store";
import { env } from "$env/dynamic/public";

export const doGetSearchResults = async (
  searchTerm: string,
  options?: {
    fetchDepth?: 'full' | 'deep' | 'shallow';
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

    searchResults.update(() => json);
  } catch {
    searchResults.update(() => []);
  } finally {
    loading.update(() => false);
  }
};
