const places = document.getElementById("places-list");
const placeTemplate = document.getElementById("place");
const groceriesBtn = document.getElementById("groceries-filter");
const pharmaciesBtn = document.getElementById("pharmacies-filter");

let placeSearch = "grocery_or_supermarket";

groceriesBtn.onclick = () => {
  if (placeSearch !== "grocery_or_supermarket") {
    groceriesBtn.classList.toggle("btn--selected");
    pharmaciesBtn.classList.toggle("btn--selected");
    placeSearch = "grocery_or_supermarket";
    places.innerHTML = "";
    initMap();
  }
};

pharmaciesBtn.onclick = () => {
  if (placeSearch !== "pharmacy") {
    pharmaciesBtn.classList.toggle("btn--selected");
    groceriesBtn.classList.toggle("btn--selected");
    placeSearch = "pharmacy";
    places.innerHTML = "";
    initMap();
  }
};

const getLocation = options => {
  return new Promise((resolve, reject) => {
    const location = navigator.geolocation;
    location.getCurrentPosition(resolve, reject, options);
  });
};

async function initMap() {
  /* google map */
  const position = await getLocation({
    enableHighAccuracy: true,
    timeout: 7000,
    maximumAge: 0
  });
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: pos,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true
  });
  const marker = new google.maps.Marker({
    position: pos,
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
  circle.bindTo("center", marker, "position");

  /* google services */
  const placesApi = new google.maps.places.PlacesService(map);
  placesApi.nearbySearch(
    { location: pos, radius: 2000, type: placeSearch },
    placesJSON => {
      placesJSON.forEach(place => {
        document.documentElement.style.setProperty(
          "--bg-icon",
          `url(${place["icon"]})`
        );
        let latLng = place["geometry"]["location"];
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: place["name"]
        });

        /* template elements */
        const expandRating = (rating, icon) => {
          let expanded = "";
          for (let i = 0; i < rating; i++) {
            expanded += ` ${icon}`;
          }
          return expanded;
        };

        let clone = placeTemplate.content.cloneNode(true);
        let title = clone.getElementById("place-title");
        let open = clone.getElementById("place-status");
        let address = clone.getElementById("place-address");
        let rating = clone.getElementById("place-rating");
        let pricing = clone.getElementById("place-pricing");

        place["opening_hours"]["open_now"]
          ? open.classList.toggle("place-status--open")
          : open.classList.toggle("place-status--closed");
        title.textContent = place["name"];
        open.textContent = place["opening_hours"]["open_now"] ? "Yes" : "No";
        address.textContent = place["vicinity"];
        rating.textContent = expandRating(place["rating"], "⭐");
        pricing.textContent = expandRating(place["price_level"], "💵");

        places.appendChild(clone);
      });
    }
  );
}