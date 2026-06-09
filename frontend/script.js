// Initialiser la carte
const map = L.map('map').setView([0, 0], 2);

// Ajouter une couche de carte (ex : OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Charger les données des escales
const chargerJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement de ${url}:`, error);
        return null;
    }
};

// Ajouter des points pour interpoler les longs segments
const ajouterInterpolation = (itineraire) => {
    const itineraireInterp = [];
    for (let i = 0; i < itineraire.length - 1; i++) {
        const start = itineraire[i];
        const end = itineraire[i + 1];
        itineraireInterp.push(start);

        // Vérifie la distance entre deux points
        const dist = Math.sqrt(
            Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
        );

        // Si la distance est grande, ajoute un point intermédiaire
        if (dist > 50) { // Ajuste le seuil si nécessaire
            const midPoint = [
                (start[0] + end[0]) / 2,
                (start[1] + end[1]) / 2,
            ];
            itineraireInterp.push(midPoint);
        }
    }
    itineraireInterp.push(itineraire[itineraire.length - 1]); // Ajouter le dernier point
    return itineraireInterp;
};

// Initialiser la carte avec les données
const initCarte = async () => {
    const escalesData = await chargerJSON('../data/escales.json');
    if (escalesData) {
        // Extraire les coordonnées des escales dans l'ordre
        const itineraire = escalesData.map(escale => [
            escale.Latitude_Décimal,
            escale.Longitude_Décimal
        ]);

        // Ajouter une interpolation pour les longs segments
        const itineraireInterp = ajouterInterpolation(itineraire);

        // Tracer l'itinéraire interpolé
        L.polyline(itineraireInterp.map(coord => [coord[0], coord[1]]), {
            color: 'blue',
            weight: 2.5,
            opacity: 1
        }).addTo(map);

        // Ajouter des marqueurs pour chaque escale
        escalesData.forEach(escale => {
            L.marker([escale.Latitude_Décimal, escale.Longitude_Décimal])
                .addTo(map)
                .bindPopup(`
                    <b>${escale['Escales du Nautilus']}</b><br>
                    Date : ${escale.Date}<br>
                    Océan/Mer : ${escale['Océan\/Mer']}<br>
                    Événement : ${escale.Event || 'Aucun événement spécifié'}
                `);
        });

        console.log('Itinéraire tracé avec interpolation.');
    } else {
        console.error("Impossible de charger les données des escales.");
    }
};

// Lancer la carte
initCarte();












    