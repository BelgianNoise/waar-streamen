<script lang="ts">
  import { onMount } from "svelte";

  let dialog: HTMLDialogElement;

  onMount(() => {
    dialog.showModal();
  });
</script>

<dialog bind:this={dialog}>
  <div class="lds-hourglass"></div>
  <h2>Aan het laden...</h2>
  <p>Dit kan even duren afhankelijk van de drukte!</p>
</dialog>

<style>
  dialog {
    border-radius: 20px;
    background-color: #333;
    border: none;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 70%;
    padding-top: 40px;
  }
  dialog::backdrop {
    background-color: rgba(0,0,0,0.8);
  }
  dialog p {
    width: 80%;
    text-align: center;
  }

  /* Loading animation */
  .lds-hourglass {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-hourglass:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 32px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-hourglass 1.2s infinite;
  }
  @keyframes lds-hourglass {
    0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    50% {
      transform: rotate(900deg);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    100% {
      transform: rotate(1800deg);
    }
  }
</style>
