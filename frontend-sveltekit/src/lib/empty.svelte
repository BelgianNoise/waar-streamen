<script lang="ts">
  import { fly, scale } from "svelte/transition";
  import { randomMeme } from "../routes/random-meme-store";
  import { spin } from "$lib/transitions/spin";
</script>

<div
  class="empty"
  in:scale
>
  <h2>Geen resultaten, hier is een random meme!</h2>
  {#if $randomMeme}
    <img
      src={$randomMeme?.url}
      alt="random meme"
      loading="lazy"
      in:spin={{ duration: 3000 }}
    />
    <a href={$randomMeme.post} target="_blank" rel="noreferrer">
      "{$randomMeme.title}" - {$randomMeme.author} ({$randomMeme.subreddit})
    </a>
  {:else}
    <img
      src="https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"
      alt="meme not loading"
      loading="lazy"
      in:fly={{ x: 2000, duration: 4000 }}
    >
  {/if}
</div>

<style>
  .empty {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    text-align: center;
  }
  img {
    max-width: 80%;
    max-height: 450px;
    object-fit: contain;
  }
</style>
