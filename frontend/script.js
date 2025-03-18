// Initialiser la carte
const map = L.map('map').setView([0, 0], 2);

// Ajouter une couche de carte (ex : OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fonction pour charger un fichier GeoJSON
const chargerGeoJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement de ${url}:`, error);
        return null;
    }
};

// Charger et afficher les continents
const initCarte = async () => {
    const continentsData = await chargerGeoJSON('../data/continents.geojson');
    if (continentsData) {
        // Filtrer uniquement les Polygons
        const polygons = continentsData.features.filter(feature => feature.geometry.type === 'Polygon');

        // Ajouter les continents sur la carte
        L.geoJSON({ type: 'FeatureCollection', features: polygons }, {
            style: {
                color: '#666',
                fillOpacity: 0.1
            }
        }).addTo(map);
        console.log('Continents ajoutés avec succès !');
    }

    // Charger les escales et corriger l'itinéraire
    const escalesData = await chargerGeoJSON('../data/escales_clusters.json');
    if (escalesData && continentsData) {
        const polygons = continentsData.features.filter(feature => feature.geometry.type === 'Polygon');

        const itineraireCorrige = escalesData
            .map(escale => [escale.Latitude_Décimal, escale.Longitude_Décimal])
            .filter(point => {
                return !polygons.some(polygon =>
                    turf.booleanPointInPolygon(turf.point(point), polygon.geometry)
                );
            });

        // Ajouter les marqueurs des escales
        escalesData.forEach(escale => {
            L.marker([escale.Latitude_Décimal, escale.Longitude_Décimal])
                .addTo(map)
                .bindPopup(`
                    <b>${escale['Escales du Nautilus']}</b><br>
                    Date: ${escale.Date}<br>
                    Océan/Mer: ${escale['Océan/Mer']}<br>
                    Événement: ${escale.Event || 'Aucun événement spécifié'}<br>
                    Cluster: ${escale.Cluster || 'Non classé'}
                `);
        });

        // Tracer l'itinéraire corrigé
        L.polyline(itineraireCorrige, { color: 'blue', weight: 2.5, opacity: 1 }).addTo(map);
    }
};

// Initialiser la carte
initCarte();




    