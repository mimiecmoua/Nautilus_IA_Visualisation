// Initialiser la carte
const map = L.map('map').setView([0, 0], 2);

// Ajouter une couche de carte (ex : OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Charger les données JSON
fetch('../data/escales_clusters.json')
    .then(response => response.json())
    .then(data => {
        // Ajouter les marqueurs pour chaque escale
        data.forEach(escale => {
            L.marker([escale.Latitude_Décimal, escale.Longitude_Décimal])
                .addTo(map)
                .bindPopup(`
                    <b>${escale['Escales du Nautilus']}</b><br>
                    Date: ${escale.Date}<br>
                    Océan/Mer: ${escale['Océan/Mer']}<br>
                    Événement: ${escale.Event || 'Aucun événement spécifié'} <br>
                    Cluster: ${escale.Cluster || 'Non classé'}
                `);
        });

        // Tracer le trajet avec une ligne
        const coordinates = data.map(escale => [escale.Latitude_Décimal, escale.Longitude_Décimal]);
        L.polyline(coordinates, { color: 'blue', weight: 2.5, opacity: 1 }).addTo(map);

         // Ajouter les sigles de début et de fin de l'aventure
         const debutAventure = [ -8.9500, -139.5333 ]; // Exemple : Île de Crespo
         const finAventure = [ 50.0000, -2.2000 ];    // Exemple : Irlande
 
         const iconeDebut = L.icon({
             iconUrl: 'sous-marin.png', // Lien vers une icône de départ
             iconSize: [40, 40], // Taille de l'icône
             iconAnchor: [20, 40] // Point d'ancrage de l'icône
         });
 
         const iconeFin = L.icon({
             iconUrl: 'sous-marin.png', // Lien vers une icône d'arrivée
             iconSize: [40, 40], // Taille de l'icône
             iconAnchor: [20, 40] // Point d'ancrage de l'icône
         });
 
         // Ajouter le marqueur de début de l'aventure
         L.marker(debutAventure, { icon: iconeDebut })
             .addTo(map)
             .bindPopup('Début de l\'aventure île de Crespo - 1er Décembre 1866 ');
 
         // Ajouter le marqueur de fin de l'aventure
         L.marker(finAventure, { icon: iconeFin })
             .addTo(map)
             .bindPopup('Fin de l\'aventure Libération du professeur Aronnax, de Conseil et de Ned Land - Manche - 2 Juin 1867');
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));

    