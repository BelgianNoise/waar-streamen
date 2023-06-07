<script lang="ts">
  import { doGetSearchResults } from "../util/functions/do-get-search-results";
  import { searchResults } from "./search-results-store";
  import type { Entry as EntryType } from "../util/models/entry";
  import Entry from "$lib/entry.svelte";
  import Welcome from "$lib/welcome.svelte";

  let searchTerm = '';

  const handleOnEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") submitSearch();
  }

  const submitSearch = () => {
    if (searchTerm.length >= 2) {
      doGetSearchResults(searchTerm);
    }
  }

  const searchResultsAmountString = (list: EntryType[] | undefined) => {
    if (!list) list = [];
    const amount = list.length;
    if (amount === 1) return `${amount} zoekresultaat`;
    return `${amount} zoekresultaten`;
  }

  $: groupedSearchResults = $searchResults?.reduce((acc: Record<string, EntryType[]>, curr: EntryType) => {
      const platform = curr.platform.trim().replace(/\s/gmi, '').toLowerCase();
      if (!acc[platform]) acc[platform] = [];
      acc[platform].push(curr);
      return acc;
    }, {});
  $: orderedSearchResults = Object.keys(groupedSearchResults || {}).reduce((acc: any[], curr: string) => {
      return [ ... acc, [ curr, groupedSearchResults[curr] ] ];
    }, []).sort((a, b) => b[1].length - a[1].length);
</script>

<div class="header">
  <div class="input-container">
    <img
      src="./search.png"
      alt="vergrootglas zoek icoontje"
    >
    <input
      type="text"
      name="searchTerm"
      placeholder="blind gekocht"
      bind:value={searchTerm}
      on:keydown={handleOnEnter}
    >
    <button on:click={submitSearch}>
      Zoeken
    </button>
  </div>
</div>

{#if groupedSearchResults}
  {#each orderedSearchResults as [platform, entries] (platform)}
    <div class="service-group">
      <div class="service-group-header">
        <img src={`./${platform}-logo.png`} alt={`${platform} logo`}>
        <span>{searchResultsAmountString(entries)}</span>
      </div>
      <div class="entries">
        {#each entries as entry (entry.link)}
          <Entry {entry} />
        {/each}
      </div>
    </div>
  {/each}
{:else}
  <Welcome />
{/if}

<style>
  .header {
    margin: auto;
    max-width: 1200px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  .header .input-container {
    width: 95%;
    max-width: 800px;
    position: relative;
    display: flex;
  }
  .header .input-container img {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    max-height: 1rem;
    object-fit: contain;
    display: none;
  }
  .header input {
    flex: 1;
    /* Needs this for some reason */
    width: 0px;
    padding: 10px 20px;
    border-radius: 20px 0 0 20px;
    background-color: rgba(80,80,80,0.4);
    font-size: 1.2rem;
    border: 1px solid #eee;
  }
  @media only screen and (min-width: 500px) {
    .header input {
      padding-left: 45px;
    }
    .header .input-container img {
      display: block;
    }
  }
  .header button {
    border-radius: 0 20px 20px 0;
    color: #111;
    background-color: #eee;
    font-weight: bold;
    padding: 0 20px 0 20px;
  }
  .header button:hover {
    background-color: #ccc;
  }

  .service-group {
    margin-bottom: 10px;
  }
  .service-group img {
    max-height: 2rem;
    margin-left: 1rem;
    max-width: 40%;
    object-fit: contain;
  }
  .service-group-header {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: end;
  }

  .entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7em, 1fr));
    grid-gap: 5px;
    padding: 20px 0;
  }
  @media only screen and (min-width: 1000px) {
    .entries {
      grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
      grid-gap: 10px;
    }
  }
</style>
