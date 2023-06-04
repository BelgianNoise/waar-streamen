<svelte:head>
    <title>Waar Streamen ?</title> 
</svelte:head>

<script>
  import '../app.css';
</script>

<div class="content">
  <slot />
</div>

<div class="footer">
  Developed by Arthur Joppart (<a href="https://github.com/belgiannoise">Github</a>) using <a href="https://kit.svelte.dev/">SvelteKit</a>
</div>


<style>
  .content {
    flex: 1;
  }
  .footer {
    text-align: center;
    border-top: 1px solid #888;
    padding-top: 20px;
  }

  :global(:root) {
    --color-vtmgo: #FF00FE;
    --color-goplay: #00F0C8;
    --color-vrtmax: #FF4942;
    --color-streamz: #020012;
  }
  :global(html) {
    padding: 0;
    margin: 0;
    display: flex;
    min-height: 100%;
  }
  :global(body) {
    flex: 1;
    padding: 0;
    margin: 20px;
    background: rgb(20,20,20);
    display: flex;
    flex-direction: column;
  }
  @media only screen and (min-width: 800px) {
    :global(body) {
      margin: 20px 60px;
    }
  }
</style>