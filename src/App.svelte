<script>
  import { onMount } from "svelte";
  import Map from "./Map.svelte";
  export let mapReady;

  let position;
  let amenity = "grocery_or_supermarket";
  let amenities = [
    { label: "Groceries", value: "grocery_or_supermarket" },
    { label: "Supermarket", value: "supermarket" },
    { label: "Offlicence", value: "liquor_store" },
    { label: "Pharmacy", value: "pharmacy" },
    { label: "Drugstore", value: "drugstore" }
  ];

  const getLocation = options => {
    return new Promise((resolve, reject) => {
      const location = navigator.geolocation;
      location.getCurrentPosition(resolve, reject, options);
    });
  };

  onMount(async () => {
    const location = await getLocation({
      enableHighAccuracy: true,
      timeout: 7000,
      maximumAge: 0
    });
    const { latitude, longitude } = location.coords;
    position = {
      lat: latitude,
      lng: longitude
    };
  });
</script>

<svelte:head>
  <script
    async
    defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBS3G0cjnQ_xK57965TUhZOxr61ng3sIUQ&callback=initMap&libraries=places,directions">

  </script>
</svelte:head>

<div class="container">

  <header>
    <h1 class="title">2km From Home</h1>
    <p class="subtitle">Find out what is near you!</p>
    <nav>
      <ul class="nav-list">
        {#each amenities as { label, value }}
          <label>
            {label}
            <input type="radio" bind:group="{amenity}" {value} />
          </label>
        {/each}
      </ul>
    </nav>
  </header>

  <main>

    {#if mapReady && position}
      <section>
        <Map {position} {amenity} />
      </section>
      {:else} <p>Locating position... 🔦</p>
    {/if}

  </main>

</div>

<footer>
  <p>Contributing to the effort 🤝</p>
</footer>

<style>

</style>
