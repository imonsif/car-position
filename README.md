# Fil d'Ariane

Appli web de chasse pour **retrouver sa voiture**. Elle enregistre la position GPS de la voiture et trace ton itinéraire. Ensuite, elle te guide pour revenir, soit **par le chemin déjà parcouru**, soit **en ligne droite**.
Elle s'installe sur l'écran d'accueil (PWA) et le guidage fonctionne **sans réseau**.

## Fonctionnement

1. **Enregistrer la voiture**. À côté du véhicule, l'appli fait la moyenne des meilleures mesures GPS pendant 6 à 20 s pour caler la position.
2. **Chasser**. La trace s'enregistre automatiquement, avec un point tous les 8 à 10 m environ. Les mesures dont la précision dépasse ±50 m sont ignorées. L'appli affiche la distance à vol d'oiseau, la direction de la voiture, la distance parcourue, la durée et le dénivelé.
3. **Revenir à la voiture**, en deux modes :
   - **Par mon chemin** (par défaut, le plus sûr en montagne). La flèche vise un repère situé environ 40 m plus loin sur ta trace aller, en direction de la voiture. Si tu t'es écarté de plus de 50 m de la trace, elle te ramène d'abord dessus.
   - **En ligne droite**. Direction et distance à vol d'oiseau, sans tenir compte du relief.
4. **Boussole**. Avec la boussole du téléphone, l'appli donne des consignes du type « tout droit », « à gauche » ou « demi-tour ». Sans boussole, elle affiche le cap en degrés, nord en haut.
5. **Carte** : fond **Relief** (OpenTopoMap, avec courbes de niveau, sentiers et oueds) ou **Satellite** (Esri). Elle affiche ta trace, la voiture, ta position avec sa précision, et le prochain repère pendant le retour.
6. **Outils** : copier les coordonnées de la voiture, exporter la trace en GPX, ouvrir l'itinéraire dans Plans ou Google Maps (avec réseau).

Les données restent sur le téléphone, dans `localStorage` (clé `filAriane.v1`). Elles survivent à la fermeture de l'appli et au redémarrage du téléphone.

## Limites à connaître

- **iPhone : l'écran doit rester allumé et l'appli au premier plan.** iOS coupe le GPS des pages web quand l'écran se verrouille ou quand on change d'appli. L'appli demande à garder l'écran allumé (Wake Lock, iOS 16.4 et plus). Si une coupure dépasse 90 s, elle te prévient : la trace relie alors directement les deux points.
- **Batterie.** GPS et écran allumés consomment beaucoup. Baisse la luminosité et emporte une batterie externe.
- **Carte hors réseau : seulement les zones déjà vues.** Les morceaux de carte (relief et satellite) sont gardés en mémoire quand tu les affiches avec du réseau. Avant la sortie, parcours ton secteur chez toi en wifi, sur chaque fond et à plusieurs niveaux de zoom (13 à 16 suffisent). Sans carte en mémoire, la trace, la voiture et le guidage s'affichent quand même sur fond gris.
- **Boussole.** La consigne en mode « boussole » est fiable si tu tiens le téléphone à plat, loin du fusil et des objets métalliques. En cas de doute, fie-toi au cap en degrés.
- C'est une aide, pas un équipement de sécurité. Emporte une vraie boussole, préviens quelqu'un de ton secteur et note la position de la voiture.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application complète (HTML, CSS, JS) |
| `manifest.webmanifest` | Installation sur l'écran d'accueil |
| `sw.js` | Cache hors ligne de l'appli et des morceaux de carte (6 000 au maximum) |
| `icon-*.png` | Icônes |
| `vendor/leaflet/` | Bibliothèque de carte Leaflet 1.9.4, embarquée pour le hors ligne |

## Mise en ligne (GitHub Pages)

La géolocalisation et le mode hors ligne exigent le **HTTPS**. GitHub Pages le fournit.

```bash
git init
git add .
git commit -m "Fil d'Ariane"
git branch -M main
git remote add origin https://github.com/<pseudo>/fil-ariane.git
git push -u origin main
```

Ensuite, dans le dépôt, va dans **Settings → Pages**, choisis la source `Deploy from a branch` et la branche `main` / `/ (root)`, puis **Save**.
L'appli est en ligne à `https://<pseudo>.github.io/fil-ariane/`.

## Installation sur iPhone

1. Ouvre l'adresse dans **Safari**, puis appuie sur **Partager** → **Sur l'écran d'accueil**.
2. Lance l'appli depuis l'icône, avec du réseau, une première fois.
3. Autorise la position, puis, si c'est demandé, choisis **« Lorsque l'app est active »** et **« Position exacte »**.
4. En mode retour, appuie sur **Activer la boussole** pour autoriser l'orientation.

Si la position est refusée, va dans Réglages → Confidentialité et sécurité → Service de localisation → Sites web Safari.

## Essayer sans sortir

Ajoute `?demo` à l'adresse (`…/fil-ariane/?demo`). L'appli charge une sortie fictive de 2 km en mode retour. Rien n'est enregistré dans la mémoire.

## Mise à jour

Change la ligne `const CACHE = "ariane-v2";` en `ariane-v3` (puis v4, etc.) dans `sw.js` avant de pousser. Sinon, le téléphone garde l'ancienne version en cache.

## Crédits des cartes

Relief : © OpenStreetMap contributors, SRTM, © OpenTopoMap (CC-BY-SA). Satellite : © Esri, Maxar, Earthstar Geographics. Ces services sont gratuits pour un usage personnel modéré : ne télécharge pas des régions entières en masse.

## Évolutions possibles

- Plusieurs points enregistrés (poste, point d'eau, gibier tombé).
- Raccourcis automatiques quand la trace fait une boucle.
- Bouton « télécharger la zone » pour mettre un secteur entier en mémoire d'un coup.
