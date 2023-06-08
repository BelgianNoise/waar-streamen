<script lang="ts">
  import { doGetSearchResults } from "../util/functions/do-get-search-results";
  import { searchResults } from "./search-results-store";
  import type { Entry as EntryType } from "../util/models/entry";
  import Entry from "$lib/entry.svelte";
  import Welcome from "$lib/welcome.svelte";
  import Empty from "$lib/empty.svelte";
  import Toggler from "$lib/toggler.svelte";
  import { exactMatchFilter } from "../util/functions/exact-match-filter";

  let searchTerm = '';
  let exactMatch = true;

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

  const orderSearchResults = (
    entries: EntryType[] | undefined,
    exactMatch: boolean,
  ): [ string, EntryType[] ][] => {
    if (!entries) return [];

    const filtered = exactMatch ? exactMatchFilter(searchTerm, entries) : entries;

    const grouped = filtered.reduce((acc: Record<string, EntryType[]>, curr: EntryType) => {
      const platform = curr.platform.trim().replace(/\s/gmi, '').toLowerCase();
      if (!acc[platform]) acc[platform] = [];
      acc[platform].push(curr);
      return acc;
    }, {});

    const ordered = Object.keys(grouped || {}).reduce((acc: any[], curr: string) => {
      return [ ... acc, [ curr, grouped[curr] ] ];
    }, []).sort((a, b) => b[1].length - a[1].length)

    return ordered;
  }

  // include exactMatch to trigger when user toggles the checkbox
  $: orderedSearchResults = orderSearchResults($searchResults, exactMatch);

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
  <div class="input-container filters">
    <span>Filters:</span>
    <div
      class="filter toggler"
      on:click|preventDefault={() => exactMatch = !exactMatch}
      on:keypress|preventDefault={() => exactMatch = !exactMatch}
    >
      <Toggler bind:checked={exactMatch} />
      <span>Exact match</span>
    </div>
    <!-- <p>Sommige platformen geven ook resultaten die enkel op deel van de zoekterm matcht. Deze optie zorgt ervoor dat je die resultaten niet te zien krijgt</p> -->
    <!-- <div class="filter">
      <select>
        <option value="full">full</option>
        <option value="deep">deep</option>
        <option value="shallow">shallow</option>
      </select>
    </div> -->
  </div>
</div>

{#if $searchResults}
  {#if orderedSearchResults.length}
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
    <Empty />
  {/if}
{:else}
  <Welcome />
{/if}

<style>
  .header {
    margin: auto;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    margin-bottom: 20px;
  }
  .header .input-container {
    width: 95%;
    max-width: 800px;
    position: relative;
    display: flex;
    justify-content: center;
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
  .header input[type="text"] {
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
    .header input[type="text"] {
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
  
  .filters {
    display: flex;
    flex-direction: row;
    gap: 40px;
    align-items: center;
    font-size: 1.2rem;
  }
  .filters > .filter {
    padding: 10px 20px;
    border-radius: 20px;
    background-color: #333;
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    justify-content: center;
  }
  .filters > .filter:hover {
    background-color: #555;
  }
  .filters > .filter.toggler {
    cursor: pointer;
  }
</style>
