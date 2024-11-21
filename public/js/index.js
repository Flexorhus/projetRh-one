// Initialisation de la carte centrée sur le point de départ
const map = L.map('map').setView([43.29785609434151, 5.49171075500044], 13);

// Ajout de la couche de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

document.getElementById('itineraireForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const depart = document.getElementById('depart').value;
    const arrivee = document.getElementById('arrivee').value;

    try {
        // Géocodage des adresses de départ et d'arrivée
        const geocodeUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";

        // Obtenir les coordonnées pour l'adresse de départ
        const departResponse = await fetch(geocodeUrl + encodeURIComponent(depart));
        const departData = await departResponse.json();
        if (departData.length === 0) {
            alert("Adresse de départ introuvable.");
            return;
        }
        const departCoords = [departData[0].lat, departData[0].lon];

        // Obtenir les coordonnées pour l'adresse d'arrivée
        const arriveeResponse = await fetch(geocodeUrl + encodeURIComponent(arrivee));
        const arriveeData = await arriveeResponse.json();
        if (arriveeData.length === 0) {
            alert("Adresse d'arrivée introuvable.");
            return;
        }
        const arriveeCoords = [arriveeData[0].lat, arriveeData[0].lon];

        // Ajout des marqueurs pour départ et arrivée
        const departMarker = L.marker(departCoords).addTo(map).bindPopup('Départ Domicile : ' + depart).openPopup();
        const arriveeMarker = L.marker(arriveeCoords).addTo(map).bindPopup('Arrivée Séminaire : ' + arrivee).openPopup();

        // Zoom pour ajuster la carte sur les deux points
        map.fitBounds([departCoords, arriveeCoords]);


        // Appel à l'API de calcul d'itinéraire (OpenRouteService dans cet exemple)
        const apiKey = '5b3ce3597851110001cf6248a6e3f2f673a048f18e86c406a94208ff';
        const itineraireUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${departCoords[1]},${departCoords[0]}&end=${arriveeCoords[1]},${arriveeCoords[0]}`;
        const itineraireResponse = await fetch(itineraireUrl);
        const itineraireData = await itineraireResponse.json();

        // Extraire les coordonnées de l'itinéraire et les tracer sur la carte
        const routeCoords = itineraireData.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        L.polyline(routeCoords, { color: 'blue' }).addTo(map);

    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        alert('Une erreur est survenue lors du calcul de l\'itinéraire.');
    }
});
