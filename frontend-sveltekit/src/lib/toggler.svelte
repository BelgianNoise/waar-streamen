<script>
  export let checked = false;
</script>

<label class="toggler-wrapper style-4">
  <input type="checkbox" {checked}>
  <div class="toggler-slider">
    <div class="toggler-knob"></div>
  </div>
</label>

<style>
  .toggler-wrapper {
    display: block;
    width: 45px;
    height: 25px;
    cursor: pointer;
    position: relative;
  }

  .toggler-wrapper input[type="checkbox"] {
    display: none;
  }

  .toggler-wrapper input[type="checkbox"]:checked+.toggler-slider {
    background-color: #44cc66;
  }

  .toggler-wrapper .toggler-slider {
    background-color: #ccc;
    position: absolute;
    border-radius: 100px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-transition: all 300ms ease;
    transition: all 300ms ease;
  }

  .toggler-wrapper .toggler-knob {
    position: absolute;
    -webkit-transition: all 300ms ease;
    transition: all 300ms ease;
  }

  .toggler-wrapper.style-4 input[type="checkbox"]:checked+.toggler-slider .toggler-knob {
    left: calc(100% - 19px - 3px);
  }

  .toggler-wrapper.style-4 .toggler-knob {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    left: 0;
    top: 0;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 6px rgba(153, 153, 153, 0.75);
    box-shadow: 0 2px 6px rgba(153, 153, 153, 0.75);
  }
</style>
