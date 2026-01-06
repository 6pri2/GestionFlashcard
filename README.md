# API RESTful de gestion de flashcards – Révision par répétition espacée

## Sommaire

- [1. Présentation du projet](#1-présentation-du-projet)  
  - [1.1 Contexte](#11-contexte)  
  - [1.2 Objectifs](#12-objectifs)  
  - [1.3 Fonctionnalités principales](#13-fonctionnalités-principales)  
- [2. Technologies utilisées](#2-technologies-utilisées)  
  - [2.1 Outils de développement](#21-outils-de-développement)  
  - [2.2 Librairies & Frameworks](#22-librairies--frameworks)  
- [3. Architecture du projet](#3-architecture-du-projet)  
- [4. Installation du projet](#4-installation-du-projet)  
  - [4.1 Prérequis](#41-prérequis)  
  - [4.2 Installation des dépendances](#42-installation-des-dépendances)  
- [5. Configuration](#5-configuration)  
  - [5.1 Variables d’environnement](#51-variables-denvironnement)  
  - [5.2 Exemple de fichier `.env`](#52-exemple-de-fichier-env)  
- [6. Initialisation de la base de données](#6-initialisation-de-la-base-de-données)  
  - [6.1 Génération des tables](#61-génération-des-tables)  
  - [6.2 Données de test / seeding](#62-données-de-test--seeding)  
- [7. Lancement du projet](#7-lancement-du-projet)  
  - [7.1 Mode développement](#71-mode-développement)  
  - [7.2 Vérification du bon fonctionnement](#72-vérification-du-bon-fonctionnement)  
- [8. Tests](#8-tests)  
  - [8.1 Tests manuels](#81-tests-manuels)  
  - [8.2 Tests automatiques](#82-tests-automatiques)  
- [9. Fonctionnalités détaillées](#9-fonctionnalités-détaillées)  
  - [9.1 Authentification](#91-authentification)  
  - [9.2 Gestion des collections](#92-gestion-des-collections)  
  - [9.3 Gestion des flashcards](#93-gestion-des-flashcards)  
  - [9.4 Répétition espacée](#94-répétition-espacée)  
  - [9.5 Gestion des utilisateurs (admin, optionnel)](#95-gestion-des-utilisateurs-admin-optionnel)  
- [10. Documentation de l’API](#10-documentation-de-lapi)  
- [11. Modèle de données](#11-modèle-de-données)  
  - [11.1 Schéma entité–relation](#111-schéma-entité-relation)  
  - [11.2 Description des entités](#112-description-des-entités)  
- [12. Auteurs](#12-auteurs)


## 1. Présentation du projet

### 1.1 Contexte
Dans le cadre de l'apprentissage assisté par technologie, ce projet vise à développer une API RESTful dédiée à la gestion de collections de flashcards.  
L'objectif est de fournir une infrastructure backend sécurisée et modulable permettant la création, la consultation et la révision des flashcards selon un algorithme de répétition espacée, favorisant la mémorisation à long terme.  
Cette API est conçue pour être exploitable par des clients externes ou des applications frontend, sans interface utilisateur intégrée à ce stade.

### 1.2 Objectifs
Ce projet poursuit un double objectif :  
1. Offrir une gestion complète et sécurisée des utilisateurs et de leurs collections, incluant un contrôle granulaire des droits d’accès et la possibilité de partager des collections publiques ou privées.  
2. Mettre en œuvre un système de révision basé sur la répétition espacée, optimisant la rétention de l’information et améliorant l’efficacité des sessions d’apprentissage.

### 1.3 Fonctionnalités principales
- **Inscription et authentification** : sécurisation des comptes utilisateurs par gestion des identifiants et chiffrement des mots de passe.  
- **Gestion des collections** : création, modification, consultation et suppression des collections, avec un mécanisme clair de contrôle de visibilité (publique ou privée).  
- **Gestion des flashcards** : chaque flashcard comporte un recto, un verso et éventuellement des supports multimédias ou liens externes, permettant une structuration riche du contenu pédagogique.  
- **Révision assistée par répétition espacée** : calcul automatique des intervalles de révision pour chaque flashcard, en fonction de son niveau de maîtrise, afin d’optimiser l’apprentissage.  
- **Administration** : fonctionnalités réservées aux administrateurs pour superviser les utilisateurs et gérer l’impact de leurs actions sur les collections et flashcards associées.
## 2. Technologies utilisées

### 2.1 Outils de développement
Le projet a été développé en s’appuyant sur des outils modernes et robustes afin de garantir efficacité, maintenabilité et qualité du code :  
- **IDE : Visual Studio Code** pour la rédaction et l’organisation du code.  
- **Node.js** comme environnement d’exécution JavaScript côté serveur.  
- **SQLite** via `@libsql/client` pour la gestion locale de la base de données, offrant une solution légère, rapide et facilement déployable.  

### 2.2 Librairies et Frameworks
Pour assurer la modularité, la sécurité et la qualité du code, les technologies suivantes ont été intégrées :  

- **Express** : framework web minimaliste pour la création de routes et le traitement des requêtes HTTP.  
- **Drizzle ORM / Drizzle-kit** : gestion des requêtes SQL et migrations de la base, garantissant une intégrité et une structure cohérente des données.  
- **Zod** : validation stricte des données entrantes (body, params, query) pour prévenir les erreurs et sécuriser l’API.  
- **bcrypt** : chiffrement des mots de passe pour sécuriser l’authentification des utilisateurs.  
- **jsonwebtoken (JWT)** : génération et vérification des tokens pour un contrôle sécurisé des accès et des sessions.  
- **dotenv** : gestion centralisée des variables d’environnement sensibles.  
- **nodemon** : rechargement automatique du serveur en mode développement, favorisant un workflow efficace.  

#### Outils de tests automatisés
- **Jest** : framework de tests unitaires et fonctionnels, utilisé pour vérifier le comportement attendu des fonctions et routes de l’API.  
- **Supertest** : bibliothèque permettant de simuler des requêtes HTTP vers l’API, facilitant les tests d’intégration et la vérification des endpoints.  
- **Babel** : transpileur JavaScript permettant d’utiliser des fonctionnalités modernes tout en garantissant la compatibilité avec l’environnement Node.js utilisé pour les tests.

## 3. Architecture du projet

L'architecture du projet a été conçue pour être **modulaire, claire et facilement maintenable**, permettant d’ajouter ou de modifier des fonctionnalités sans impacter le reste du système.  
L’organisation des dossiers reflète la séparation des responsabilités, garantissant lisibilité, testabilité et évolutivité.

### 3.1 Organisation générale
Le projet suit une structure modulaire, où chaque dossier correspond à un rôle précis dans le fonctionnement de l’API : logique métier, routes, accès aux données, middlewares et tests.  

### 3.2 Arborescence des dossiers

``` bash
GestionFlashcard/
├── src/
│ ├── controllers/ # Logique métier des routes
│ │ └── models/ # Définition des entités et schémas des données
│ ├── db/ # Configuration DB, migrations, seeders
│ ├── middlewares/ # Authentification, gestion des rôles, gestion des erreurs
│ ├── routes/ # Définition des endpoints et gestion des requêtes HTTP
│ └── tests/ # Tests unitaires et d'intégration (Jest + Supertest)
│ └── server.js # Point d'entrée du serveur
├── .env # Variables d'environnement
├── .gitignore # Fichiers à ignorer par Git
├── babel.config.js # Configuration Babel
├── drizzle.config.js # Configuration de Drizzle ORM
├── jest.config.cjs # Configuration Jest
├── jest.setup.js # Setup des tests Jest
├── package.json # Dépendances et scripts npm
├── package-lock.json # Version lock des packages
└── README.md # Documentation du projet
```

## 4. Installation du projet

Cette section décrit les étapes nécessaires pour préparer l’environnement et lancer l’API de manière efficace et reproductible.

### 4.1 Prérequis
Avant toute installation, assurez-vous de disposer des éléments suivants :  
- **Node.js** version 18 ou supérieure, pour l’exécution du serveur et des scripts.  
- **npm** (ou yarn) pour la gestion des dépendances.  
- Un terminal compatible (bash, zsh, ou Windows PowerShell / Terminal).  

### 4.2 Installation des dépendances
Récupérez les dépendances du projet depuis le registre npm :  

```bash
npm install
```
Cette commande installe l’ensemble des librairies nécessaires au fonctionnement de l’API, y compris Express, Drizzle ORM, Zod, bcrypt, jsonwebtoken, et les outils de tests (Jest, Supertest, Babel).

### 4.3 Configuration des variables d’environnement
Le projet nécessite la présence d’un fichier `.env` à la racine afin de définir les variables d’environnement indispensables à son fonctionnement.  
Ces variables permettent notamment de configurer l’accès à la base de données et la sécurisation de l’authentification.

Les variables requises sont les suivantes :
- `DB_FILE_NAME` : chemin vers le fichier de base de données SQLite.  
- `JWT_SECRET` : clé secrète utilisée pour la génération et la vérification des tokens JWT.

Exemple de fichier `.env` :

```env
DB_FILE_NAME=file:local.db
JWT_SECRET=001628da30d11a300369f28b20c2b4acbfab0f3182f998fe6454242df9a97d4143849c05cb3d537cea687da723c0c1f73f1c8e1d721dfdf3237f2afc015ae297
```

### 4.4 Initialisation de la base de données
L’initialisation de la base de données repose sur l’utilisation de **Drizzle ORM** et s’effectue en deux étapes principales.

La première consiste à créer ou mettre à jour les tables selon le schéma défini dans le projet :

```bash
npm run db:push
```

Cette commande applique automatiquement la structure de la base de données en fonction des fichiers de configuration définis avec Drizzle ORM.

La seconde étape permet d’insérer des données de test afin de disposer d’un environnement prêt à l’emploi :

```bash
npm run db:seed
```

Ce script initialise la base avec des utilisateurs, des collections et des flashcards de démonstration, permettant de disposer rapidement d’un environnement fonctionnel pour les tests manuels et automatisés.

Dans le cadre des tests automatisés, cette étape est essentielle afin de garantir des résultats reproductibles et cohérents.

> ⚠️ Il est fortement recommandé d’exécuter successivement `db:push` puis `db:seed` avant le premier lancement du serveur ou l’exécution des tests, afin de garantir un état cohérent et stable de la base de données.

### 4.5 Lancement du serveur en mode développement
Le serveur peut être lancé en mode développement à l’aide de la commande suivante :

```bash
npm run dev
``` 
Ce mode utilise `nodemon` pour redémarrer automatiquement le serveur à chaque modification du code source, améliorant ainsi la rapidité des cycles de développement et facilitant les phases de test.

Par défaut, l’API est accessible à l’adresse suivante :
- http://localhost:3000

Il est également possible de visualiser et d’administrer la base de données à l’aide de **Drizzle Studio** grâce à la commande suivante :

```bash
npm run db:studio
```

Cette interface permet d’inspecter les tables, de consulter les données et de vérifier rapidement la cohérence de la base lors du développement.

## 5. Tests

Des tests manuels et automatisés ont été mis en place afin de garantir le bon fonctionnement, la stabilité et la conformité de l’API aux spécifications définies.

### 5.1 Tests manuels
Les tests manuels ont été réalisés à l’aide de **Thunder Client** (extension Visual Studio Code) ou d’outils équivalents tels que Postman.

Ils permettent de :
- vérifier le bon fonctionnement des endpoints,
- tester les différents scénarios d’authentification et de permissions (utilisateur / administrateur),
- valider les opérations de création, modification, consultation et suppression des collections et flashcards,
- contrôler le comportement du système de répétition espacée lors des révisions.

### 5.2 Tests automatisés
Des tests automatisés ont été implémentés afin de vérifier de manière systématique et reproductible le comportement de l’API.

Les technologies utilisées sont :
- **Jest** : framework de tests pour l’exécution des tests unitaires et fonctionnels,
- **Supertest** : bibliothèque permettant de simuler des requêtes HTTP vers l’API,
- **Babel** : transpileur JavaScript garantissant la compatibilité de l’environnement de tests.

Les tests sont exécutés à l’aide de la commande suivante :

```bash
npm test
```

Cette commande :
- définit l’environnement d’exécution en mode test (`NODE_ENV=test`),
- initialise une base de données dédiée aux tests,
- exécute automatiquement le script de seeding afin de garantir un état connu et cohérent de la base,
- lance l’ensemble des tests de manière séquentielle (`--runInBand`) afin d’éviter les conflits liés à l’utilisation de SQLite.

À l’issue de l’exécution des tests, la base de données est à nouveau seedée afin de conserver un état propre et exploitable pour d’éventuelles vérifications manuelles.

Les tests automatisés couvrent l’ensemble des cas fonctionnels identifiés lors de la conception de l’API, notamment :
- les scénarios d’authentification et de gestion des rôles,
- la gestion des collections et des flashcards,
- le respect des droits d’accès selon la visibilité des ressources,
- le comportement du système de répétition espacée.

Les erreurs internes du serveur (codes HTTP 500) ne sont volontairement pas testées, celles-ci relevant de cas exceptionnels non déterministes.  
L’objectif principal des tests est de valider le bon fonctionnement de l’API dans des conditions normales d’utilisation et de garantir la fiabilité des fonctionnalités implémentées.

## 6. Documentation de l’API

### 6.1 Authentification

Les endpoints d’authentification permettent la création de compte, la connexion et la récupération des informations de l’utilisateur connecté.  
L’authentification repose sur des JSON Web Tokens (JWT) transmis via l’en-tête `Authorization`.

---

### POST /auth/register

**Description**  
Crée un nouveau compte utilisateur.

**Authentification requise**  
Aucune.

**Validation (Zod)**  
- `email` : string valide au format email  
- `firstname` : string de taille entre 3 et 30 caractères
- `lastname` : string de taille entre 3 et 30 caractères 
- `password` : string de taille entre 6 et 255 caractères

**Body attendu**
- `email` (string)
- `firstname` (string)
- `lastname` (string)
- `password` (string)
```json
{
  "email" : "test3@test.com",
  "firstname" : "Édouard",
  "lastname" : "Paul",
  "password" : "cypcyp"
}
```
**Réponse – Succès (201)**
```json
{
  "message": "User created",
  "userDate": {
    "email": "test3@test.com",
    "firstname": "Édouard",
    "lastname": "Paul",
    "id": "fca23035-97e9-4007-a296-9e8532183906"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmY2EyMzAzNS05N2U5LTQwMDctYTI5Ni05ZTg1MzIxODM5MDYiLCJlbWFpbCI6InRlc3QzQHRlc3QuY29tIiwiZmlyc3RuYW1lIjoiw4lkb3VhcmQiLCJsYXN0bmFtZSI6IlBhdWwiLCJpYXQiOjE3Njc3MzMzNzUsImV4cCI6MTc2NzgxOTc3NX0.2vRZofkxQarrxsy_93MLhp0XezfZuwBte3K5MK2JrnI"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `500 Internal Server Error` : erreur interne du serveur

---

### POST /auth/login

**Description**  
Authentifie un utilisateur existant et retourne un token JWT permettant d’accéder aux routes protégées de l’API.

**Authentification requise**  
Aucune.

**Validation (Zod)**  
- `email` : string valide au format email  
- `password` : string non vide de taille entre 6 et 255 caractères

**Body attendu**
- `email` (string)
- `password` (string)

```json
{
  "email" : "test@test.com",
  "password" : "motdepasse"
}
```

**Réponse – Succès (200)**
```json
{
  "message": "User logged in",
  "userData": {
    "id": "3e5ab941-2b2a-4f57-958d-a361a82628c2",
    "email": "test@test.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZTVhYjk0MS0yYjJhLTRmNTctOTU4ZC1hMzYxYTgyNjI4YzIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJmaXJzdG5hbWUiOiJhbGV4YW5kcmUiLCJsYXN0bmFtZSI6IkxlUm95IiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE3Njc3MzMyNDUsImV4cCI6MTc2NzgxOTY0NX0.XTEtfyn7kSArH6IXmjJOO3ScHQ7rBEL_pmWbg-5-s0c"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : email ou mot de passe incorrect
- `500 Internal Server Error` : erreur interne du serveur

---

### GET /auth/information

**Description**  
Récupère les informations du compte de l’utilisateur actuellement authentifié.

**Authentification requise**  
Oui — token JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
Aucun.

**Réponse – Succès (200)**
```json
{
  "message": "User information :",
  "userData": {
    "id": "fca23035-97e9-4007-a296-9e8532183906",
    "firstname": "Édouard",
    "lastname": "Paul",
    "email": "test3@test.com"
  }
}
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide
- `404 Not Found` : utilisateur non trouvé
- `500 Internal Server Error` : erreur interne du serveur


## 9. Fonctionnalités détaillées

### 9.1 Authentification
- Inscription (email, prénom, nom, mot de passe)  
- Connexion (email + mot de passe)  
- Récupération des informations du compte (optionnel)

### 9.2 Gestion des collections
- Création, consultation, modification, suppression  
- Visibilité : public / privé  
- Recherche de collections publiques  
- Accès limité aux propriétaires pour les collections privées

### 9.3 Gestion des flashcards
- Création, consultation, modification, suppression  
- Flashcards associées à des collections  
- Images / URLs optionnelles pour le recto et verso  
- Accès limité aux propriétaires ou collections publiques

### 9.4 Répétition espacée
- 5 niveaux de révision avec délai progressif :

| Niveau | Délai (jours) |
|--------|---------------|
| 1      | 1             |
| 2      | 2             |
| 3      | 4             |
| 4      | 8             |
| 5      | 16            |

- Mise à jour automatique du niveau et de la date de prochaine révision après chaque révision

### 9.5 Gestion des utilisateurs (admin, optionnel)
- Listage, consultation et suppression des utilisateurs  
- Accès restreint uniquement aux administrateurs

---

## 10. Documentation de l’API
- Liste complète des endpoints avec :  
  - Méthode HTTP et chemin  
  - Authentification requise (publique / user / admin)  
  - Description des paramètres (body, query, route)

---

## 11. Modèle de données

### 11.1 Schéma entité–relation
- Tables principales : `users`, `collections`, `flashcards`, `user_flashcards` (pour la révision personnelle)  
- Clés primaires / étrangères et relations entre entités

### 11.2 Description des entités
- Champs pertinents pour la répétition espacée  
- Relations entre utilisateurs, collections et flashcards

## 8. Auteurs

Ce projet a été réalisé dans le cadre du cours **R5.05 – Projet de groupe**, encadré par **M. Clément Catel** :   
- Github : `ClementCatel`  
- Email : `clement.catel@unicaen.fr`
- Sujet : `https://clementcatel.notion.site/R5-05-Projet-de-groupe-2ae3b8266dbb8014b0aac3869c316f7c` 

Réalisé par : 

- **Duroy Cyprien** – Github : `6pri2` – Email : `cyprien.duroy@etu.unicaen.fr`  
- **Alexandre Le Roy** – Github : `z0ralex` – Email : `alexandre.leroy01@etu.unicaen.fr`  