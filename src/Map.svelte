<script>
  import { onMount } from "svelte";
  export let position;
  export let amenity;

  let container;
  let map;
  let placesApi;
  let directionsService;
  let directionsRenderer;
  let currentPlaces;
  let markers = [];

  const drawDirections = place => {
    let { lat, lng } = position;
    directionsService.route(
      {
        origin: new google.maps.LatLng(position),
        destination: place["geometry"]["location"],
        travelMode: "DRIVING"
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert(`Directions request failed due to ${status}`);
        }
      }
    );
  };

  const drawPlaceMarkers = () => {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    currentPlaces.forEach(place => {
      let latLng = place["geometry"]["location"];
      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: place["name"]
      });
      marker.addListener("click", () => {
        drawDirections(place);
      });
      markers.push(marker);
    });
  };

  $: {
    if (placesApi && position) {
      placesApi.nearbySearch(
        { location: position, radius: 2000, type: amenity },
        places => {
          currentPlaces = places;
          drawPlaceMarkers();
        }
      );
    }
  }

  const expandRating = (rating, icon) => {
    let expanded = "";
    for (let i = 0; i < rating; i++) {
      expanded += ` ${icon}`;
    }
    return expanded;
  };

  onMount(async () => {
    map = new google.maps.Map(container, {
      zoom: 13,
      center: position,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true
    });
    const markerMe = new google.maps.Marker({
      position: position,
      label: {
        color: "#fff",
        text: "You",
        fontWeight: "bold"
      },
      map: map,
      title: "You"
    });
    const circle = new google.maps.Circle({
      map: map,
      radius: 2000,
      fillColor: "#AA0000",
      fillOpacity: 0.2,
      strokeWeight: 1,
      strokeColor: "#F23D3D"
    });
    circle.bindTo("center", markerMe, "position");
    placesApi = new google.maps.places.PlacesService(map);
    placesApi.nearbySearch(
      { location: position, radius: 2000, type: amenity },
      places => {
        currentPlaces = places;
        drawPlaceMarkers();
      }
    );
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
  });
</script>

<div class="map-container" bind:this="{container}"></div>
<ul class="places" id="places-list">
  {#if currentPlaces}
    {#each currentPlaces as place, index}
      <li
        class="place"
        style="--place-index:{index}; --bg-icon:url({place['icon']})">
        <h2>{place['name']}</h2>
        <p>
          Open Now:
          <span class="place-status">
            {place['opening_hours'] ? (place['opening_hours']['open_now'] ? 'Yes' : 'No') : 'No'}
          </span>
        </p>
        <p>
          Address:
          <span>{place['vicinity']}</span>
        </p>
        <p>
          Rating:
          <span>{expandRating(place['rating'], '⭐')}</span>
        </p>
        <p>
          Pricing:
          <span>{expandRating(place['price_level'], '💵')}</span>
        </p>
      </li>
    {/each}
  {:else}Loading...{/if}
</ul>

<style>

</style>
