# 📓 Notebooks — Exploration du Nautilus

> Documentation technique des notebooks JupyterLab, algorithmes, données et expérimentations IA.

---

## 🗂️ Structure du dossier

```
notebooks/
├── Map_nautilus_v16.ipynb            # Notebook principal — génère la carte HTML
├── test_decouvertes.ipynb            # Notebook de test — fiche Explorations 1
├── test_comparaison.ipynb            # Notebook de test — fiche Explorations 2
├── Points-escales-chapitres.json     # 32 escales avec coordonnées et métadonnées
├── especes_maritimes_livre.json      # 572 espèces relevées manuellement
├── decouvertes_zones.json            # Découvertes XIXe générées par Ollama
├── comparaison_zones.json            # Comparaison 1866/aujourd'hui par Ollama
└── data_texts/
    └── 20000lieues_fr.txt            # Roman en français (908 396 caractères)
```

---

## 📓 Notebook principal — Map_nautilus_v16.ipynb

### Rôle
Génère le fichier `nautilus_map_v16.html` — la carte interactive complète avec tous les contenus.

### Pipeline d'exécution

```
1. Chargement des données
   ├── Points-escales-chapitres.json  →  32 escales
   └── 20000lieues_fr.txt             →  908 396 caractères

2. Extraction des extraits (Entrée 1)
   ├── Algorithme d'ancres textuelles
   ├── Découpage par chapitres (CHAPITRE I → CHAPITRE XXIV × 2 parties)
   └── 30/32 extraits trouvés — 2 ancres non trouvées (points intermédiaires)

3. Chargement des espèces (Entrée 2)
   └── especes_maritimes_livre.json  →  572 espèces formatées en HTML

4. Chargement des explorations IA
   ├── decouvertes_zones.json   →  9 zones × découvertes XIXe
   └── comparaison_zones.json   →  9 zones × comparaison 1866/aujourd'hui

5. Génération de la carte Folium
   ├── Fond de carte CartoDB Positron
   ├── Trajet turquoise #27c39f
   ├── 32 marqueurs avec popups HUD
   └── 9 polygones pastels transparents (fill_opacity=0.18)

6. Injection HTML/CSS/JS
   ├── Interface HUD noir/turquoise
   ├── Modals avec scrollbar turquoise
   ├── Boutons flottants animés
   └── Panneaux légendes avec transition CSS

7. Sauvegarde
   └── nautilus_map_v16.html
```

---

## 🔍 Algorithme d'extraction des extraits

### Principe
Extraction directe depuis le fichier `.txt` sans IA — 100 % fidèle au texte de Jules Verne.

### Méthode des ancres
Chaque escale possède une **ancre** — la première phrase caractéristique du passage correspondant dans le roman.

```python
ANCRES_ESCALES = {
    "Île de Crespo": "Je m'habillai lestement",
    "Méditerranée": "serpentaient quelques-unes de ces lamproies",
    ...
}
```

### Découpage par chapitres
```python
# Split sur la frontière entre les deux parties
split = texte.split("FIN DE LA PREMIÈRE PARTIE")

# Extraction par marqueur romain
ROMAINS_FR = {1:"PREMIER", 2:"II", 3:"III", ... 24:"XXIV"}
marqueur = f"CHAPITRE {romain}"
idx = zone.find(marqueur)
idx_fin = zone.find("CHAPITRE", idx + len(marqueur))
chapitre = zone[idx:idx_fin]
```

### Résultats
| Statut | Nombre |
|--------|--------|
| ✅ Extraits trouvés | 30 |
| ⏭️ Points intermédiaires (skip) | 4 |
| ⚠️ Ancres non trouvées | 2 |

---

## 🐟 Données espèces maritimes

### Méthode de collecte
Relevé **100 % manuel** — lecture chapitre par chapitre du roman, escale par escale.

### Structure du JSON
```json
{
  "Méditerranée": {
    "faune": ["Lamproies", "Oxyrhynques", "Squales-milandres", ...],
    "flore": ["Pavonacées"]
  }
}
```

### Statistiques
| Catégorie | Nombre |
|-----------|--------|
| 🐠 Faune maritime | 528 espèces |
| 🌿 Flore maritime | 44 espèces |
| **Total** | **572 espèces** |
| Escales couvertes | 28 / 32 |
| Escales sans espèces | 4 (points intermédiaires) |

### Chapitre le plus riche
**Méditerranée (ch. 7)** — 88 espèces dont mollusques, crustacés, poissons, mammifères marins

---

## 🌊 Zones océaniques — 9 clusters

| Zone | Couleur | Escales rattachées |
|------|---------|-------------------|
| Océan Pacifique Sud | `#7ec8c8` | Île de Crespo, Pomotou, Nouvelles-Hébrides, Pouasie, Cap Wessel, Timor |
| Océan Indien | `#a8d8a8` | Île Keeling, Golfe du Bengale |
| Mer Rouge | `#f4c2a1` | Isthme de Suez |
| Méditerranée | `#c8a8d8` | Archipel grec, Méditerranée, Atlantide |
| Océan Atlantique Sud | `#a8c8d8` | Sargasses, Cap Horn, Martinique, Lucayes |
| Pôle Sud | `#d8d8f4` | Pôle Sud, Cap Horn (retour) |
| Océan Atlantique Nord | `#b8d4f0` | Cap Hatteras, Long Island, Terre Neuve |
| Mers Celtiques et Manche | `#f0d4a8` | Irlande, Manche, Angleterre Sud |
| Mer de Norvège et Maelström | `#d4f0e0` | Angleterre Nord, Maelström |

---

## 🤖 Expérimentations Ollama / Mistral

### Modèle utilisé
- **Mistral 7B** via Ollama en local
- Port : `http://localhost:11434/api/generate`
- Température : **0.2** (basse pour rester factuel)
- num_predict : **2000**

### Évolution du prompting — Fiche Espèces (abandonnée)

Plusieurs approches testées et abandonnées avant de passer au relevé manuel :

| Tentative | Problème constaté |
|-----------|------------------|
| Prompt long avec format complexe | Ollama ignore le format, invente des espèces |
| Fenêtre 6 000 caractères | Rate les espèces en fin de chapitre |
| Fenêtre 10 000 caractères | Mieux mais encore des oublis |
| Chapitre complet envoyé | Génère des listes infinies en boucle |
| Prompt ultra-simple | Liste des humains comme espèces maritimes 😄 |
| **Décision finale** | **Relevé manuel chapitre par chapitre** ✅ |

### Prompting retenu — Fiche Découvertes XIXe

```python
def prompt_decouvertes(nom_zone, description_zone):
    return f"""Tu es un historien des sciences spécialisé dans le XIXe siècle.

ZONE : {nom_zone}
DESCRIPTION : {description_zone}

Liste 6 à 8 découvertes scientifiques maritimes (1800-1900) spécifiques à cette zone.
DATES STRICTEMENT entre 1800 et 1900.
Varie les scientifiques — ne cite pas plusieurs fois le même.

FORMAT :
🔬 [Scientifique] ([année]) — [découverte]
   [Une phrase de contexte]
"""
```

### Corrections manuelles post-génération
Certaines entrées ont été corrigées manuellement après vérification :

| Zone | Problème | Correction |
|------|----------|-----------|
| Océan Pacifique Sud | Bougainville 1768 (XVIIIe !) | Remplacé par Dumont d'Urville 1838 |
| Océan Pacifique Sud | Livingstone (explorateur terrestre) | Remplacé par John MacGillivray |
| Mers Celtiques | Darwin — théorie générale évolution | Remplacé par Edward Forbes, Philip Gosse |
| Mer de Norvège | Wegener 1905 (XXe !) | Remplacé par Henrik Mohn 1876 |
| Mer de Norvège | Format **gras** au lieu de 🔬 | Corrigé par regex |

### Prompting retenu — Fiche Comparaison XIXe/Aujourd'hui

Structure en 4 sections obligatoires :
- ⚓ AU XIXe SIÈCLE (vers 1866)
- 🌊 AUJOURD'HUI
- ⚠️ PROBLÈMES ENVIRONNEMENTAUX ACTUELS
- 📜 LOIS ET PROTECTIONS EN VIGUEUR

Contexte Jules Verne injecté dans le prompt pour valoriser son génie visionnaire (le Plongeur 1863, premier sous-marin français).

---

## 📊 Analyse des données

### Répartition des extraits par longueur

| Taille | Escales |
|--------|---------|
| < 1000 car. | 3 escales |
| 1000 — 2000 car. | 8 escales |
| 2000 — 3000 car. | 12 escales |
| > 3000 car. | 7 escales |

### Chapitre le plus long analysé
**Méditerranée ch. 7** — 22 108 caractères

### Fichier texte source
- **Taille** : 908 396 caractères
- **Langue** : Français uniquement
- **Découpage** : `split("FIN DE LA PREMIÈRE PARTIE")` → 2 zones
- **Marqueurs chapitres** : `CHAPITRE {ROMAIN}` en majuscules

---

## 🛠️ Dépendances Python

```bash
pip install folium pandas
```

| Bibliothèque | Version | Usage |
|-------------|---------|-------|
| `folium` | latest | Carte interactive Leaflet.js |
| `pandas` | latest | Manipulation DataFrame escales |
| `json` | stdlib | Lecture/écriture JSON |
| `urllib.request` | stdlib | Appels API Ollama |
| `re` | stdlib | Expressions régulières |
| `pathlib` | stdlib | Gestion des chemins fichiers |
| `IPython.display` | JupyterLab | Affichage Markdown dans notebook |

---

## ⚠️ Notes techniques

- **"Noyau absent"** dans JupyterLab → bug d'affichage uniquement, le kernel fonctionne
- **Ollama "bind: Only one usage of each socket"** → Ollama déjà lancé, normal
- **Encodage** : tous les fichiers en UTF-8 avec `errors="ignore"`
- **Sauts de ligne** : `.replace('\r\n', '\n').replace('\r', '\n')` systématique sur Windows

---

© 2026 WebOara — Émilie Clain
