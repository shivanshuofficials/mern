const listing = window.listingData;
mapboxgl.accessToken = mapToken;

console.log("Map.js - Listing:", listing);
if (listing) {
    console.log("Map.js - Geometry:", listing.geometry);
    if (listing.geometry) {
        console.log("Map.js - Coordinates:", listing.geometry.coordinates);
    }
}

if (listing && listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Create a default Marker with popup
    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
        )
        .addTo(map);

    // Handle Map Load & Skeleton
    map.on('load', function () {
        console.log("Map loaded successfully");
        const skeleton = document.getElementById('map-skeleton');
        const mapContainer = document.getElementById('map');

        if (skeleton) skeleton.style.display = 'none';
        if (mapContainer) mapContainer.style.display = 'block';

        map.resize();
    });

    // Fallback if load event doesn't fire quickly
    setTimeout(() => {
        const skeleton = document.getElementById('map-skeleton');
        const mapContainer = document.getElementById('map');
        if (mapContainer && mapContainer.style.display === 'none') {
            console.log("Forcing map display...");
            if (skeleton) skeleton.style.display = 'none';
            mapContainer.style.display = 'block';
            map.resize();
        }
    }, 3000);

} else {
    console.error("Listing geometry is missing or invalid.", listing);
    const skeleton = document.getElementById('map-skeleton');
    const mapContainer = document.getElementById('map');
    if (skeleton) skeleton.style.display = 'none';
    if (mapContainer) mapContainer.innerHTML = "<p>Location data not available.</p>";
    if (mapContainer) mapContainer.style.display = 'block';
}
