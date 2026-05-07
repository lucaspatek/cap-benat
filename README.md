# Cap Benat — Calendrier familial

Calendrier partagé pour la résidence des Mimosas à Bormes.

---

## Déploiement (une seule fois)

### 1. Créer le repo GitHub

```bash
git init
git add .
git commit -m "init cap-benat"
gh repo create cap-benat --public --push --source=.
```

### 2. Déployer sur Vercel

```bash
npx vercel --prod
```

Suivre les instructions : sélectionner le bon compte, pas de framework détecté → OK.

### 3. Créer la base de données Vercel KV

Sur https://vercel.com → ton projet → Storage → Create Database → KV

Puis dans Settings → Environment Variables → les variables KV_URL, KV_REST_API_URL etc. sont ajoutées automatiquement.

### 4. Redéployer après avoir lié le KV

```bash
npx vercel --prod
```

### 5. Partager le lien

Copier l'URL Vercel (ex: cap-benat.vercel.app) et l'épingler dans WhatsApp.

---

## Mise à jour

Pour modifier la liste des membres ou ajouter des réservations initiales, éditer `api/reservations.js` puis redéployer :

```bash
npx vercel --prod
```
