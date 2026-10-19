# Guide du site CV : où modifier quoi ?

## Les fichiers

| Fichier | Rôle | Quand l'ouvrir |
|---|---|---|
| `app.py` | Le serveur Flask + tes coordonnées | Changer email, téléphone, ville, LinkedIn, nom du PDF |
| `templates/index.html` | **Tout le texte** de la page | Changer une phrase, une date, une expérience, un projet |
| `static/styles.css` | L'apparence | Changer une couleur, une taille, un espacement |
| `static/script.js` | Les animations et comportements | En principe, rien à modifier |
| `static/img/` | Photo et logos | Remplacer la photo, ajouter un logo |
| `static/cv/CV_Camille_Esnault.pdf` | Ton CV en PDF | Remplacer par une nouvelle version (même nom) |

Chaque fichier commence par un commentaire qui explique son organisation.

## Modifications courantes

**Changer ton email, téléphone ou LinkedIn**
→ `app.py`, dans le bloc `profil = { … }`. Le changement s'applique partout sur le site.
(Le lien `tel:+33673669755` dans `index.html`, partie Contact, est à changer aussi pour le téléphone.)

**Mettre à jour ton CV PDF**
→ Remplace `static/cv/CV_Camille_Esnault.pdf` par le nouveau fichier, en gardant exactement ce nom.

**Retirer « Indisponible en novembre 2026 »**
→ `index.html`, supprime la ligne qui contient `eyebrow--away`.

**Changer les métiers qui s'écrivent tout seuls**
→ `index.html`, attribut `data-words="Data Analyst|Data Scientist|Data Engineer"` (séparés par `|`).

**Changer un mot dans les bulles autour de la photo**
→ `index.html`, bloc `<ul class="keywords">`. Si le nouveau mot est plus long, les bulles
risquent de se toucher en tournant : il faudra réajuster les angles (`--start`).

**Ajouter une expérience, une formation ou un projet**
→ `index.html` : copie un bloc complet (`<li class="tl-item"> … </li>` pour le parcours,
`<article class="project"> … </article>` pour les projets) et modifie le contenu.
L'encart violet du parcours et le compteur des projets se mettent à jour tout seuls.

**Ajouter un logiciel**
→ Mets le logo dans `static/img/`, puis ajoute `('nom_du_logo.png', 'Nom')` dans la liste
`outils` de `index.html`. Pense aussi à mettre à jour le chiffre « 11 logiciels & langages ».

**Changer la couleur violette du site**
→ `static/styles.css`, partie 0, variable `--violet`.

**Apparaître sur Google**
→ `index.html`, supprime la ligne `<meta name="robots" content="noindex, nofollow">`.

## Tester sur ton ordinateur

```
pip install -r requirements.txt
python app.py
```

Puis ouvre http://127.0.0.1:5000/ dans ton navigateur.
