// // routes.js
// export async function fetchRoute(apiKey, departCoords, arriveeCoords) {
//     const itineraireUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${departCoords[1]},${departCoords[0]}&end=${arriveeCoords[1]},${arriveeCoords[0]}`;
//     const response = await fetch(itineraireUrl);
//     const data = await response.json();
//     return data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
// }