// // geocode.js
// export async function geocodeAddress(address) {
//     const geocodeUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
//     const response = await fetch(geocodeUrl + encodeURIComponent(address));
//     const data = await response.json();
//     if (data.length === 0) {
//         throw new Error("Adresse introuvable");
//     }
//     return [data[0].lat, data[0].lon];
// }