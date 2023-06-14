<script lang="ts">
  import type { Entry } from "../util/models/entry";
  import { slide } from 'svelte/transition';

  export let entry: Entry;
  $: seasons = Object.keys(entry.seasons).length;
  $: episodes = Object.values(entry.seasons)
    .reduce((acc: number, curr: number[]) =>  acc + curr.length, 0);

  $: platform = entry.platform.trim().replace(/\s/gmi, '').toLowerCase()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="container {platform}"
  in:slide={{ duration: 500 }}
  out:slide={{ duration: 500 }}
  on:click={() => window.open(entry.link, '_blank')}
>
  <div class="image-container">
    <img src={entry.imageUrl || "./poster-not-found.png"} alt="poster" loading="lazy">
    {#if entry.language}
      <span class="language-flag">      
        {#if ['en'].includes(entry.language)}
          <img src="./flag-en.png" alt="british flag" loading="lazy">
        {:else if ['nl-nl'].includes(entry.language)}
          <img src="./flag-nl.png" alt="dutch flag" loading="lazy">
        {:else if ['nl-be'].includes(entry.language)}
          <img src="./flag-be.png" alt="belgian flag" loading="lazy">
        {/if}
      </span>
    {/if}
    <span class="lang"></span>
  </div>
  <span class="title">{entry.title}</span>
  {#if seasons > 0 || episodes > 0}
    <span class="seasons">
      {#if seasons === 1}
        {seasons} seizoen
      {:else if seasons > 1}
        {seasons} seizoenen
      {/if}
      {#if episodes > 0}
        - {episodes} afl
      {/if}
    </span>
  {/if}
</div>

<style>
  .container {
    background-color: rgba(80,80,80,0.2);
    border-radius: 10px;
    padding: 10px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
  .container:hover {
    transform: scale(1.05);
    border: 1px solid #ddd;
    background-color: rgba(80,80,80,0.5);
  }
  .container.vtmgo:hover {
    border-color: var(--color-vtmgo);
    background: linear-gradient(160deg, var(--color-vtmgo) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.goplay:hover {
    border-color: var(--color-goplay);
    background: linear-gradient(160deg, var(--color-goplay) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.vrtmax:hover {
    border-color: var(--color-vrtmax);
    background: linear-gradient(160deg, var(--color-vrtmax) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.streamz:hover {
    border-color: var(--color-streamz);
    background: linear-gradient(160deg, var(--color-streamz) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.netflix:hover {
    border-color: var(--color-netflix);
    background: linear-gradient(160deg, var(--color-netflix) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.apple:hover {
    border-color: var(--color-apple);
    background: linear-gradient(160deg, var(--color-apple) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.disney:hover {
    border-color: var(--color-disney);
    background: linear-gradient(160deg, var(--color-disney) 10%, rgba(80,80,80,0.5) 30%);
  }
  .container.prime:hover {
    border-color: var(--color-prime);
    background: linear-gradient(160deg, var(--color-prime) 10%, rgba(80,80,80,0.5) 30%);
  }
  .image-container {
    position: relative;
  }
  .image-container > img {
    width: 100%;
    aspect-ratio: 7/10;
    object-fit: cover;
  }
  .image-container .language-flag {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
  .image-container .language-flag img {
    height: 15px;
    object-fit: contain;
  }
  .title {
    flex: 1;
    padding: 5px 0;
  }
  .seasons {
    color: #aaa;
    font-size: 0.8rem;
  }
  @media only screen and (min-width: 800px) {
    .seasons {
      font-size: 0.9rem;
    }
  }
</style>
