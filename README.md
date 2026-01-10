# API RESTful de gestion de flashcards – Révision par répétition espacée

## Sommaire

## Sommaire

- [1. Présentation du projet](#1-présentation-du-projet)
  - [1.1 Contexte](#11-contexte)
  - [1.2 Objectifs](#12-objectifs)
  - [1.3 Fonctionnalités principales](#13-fonctionnalités-principales)

- [2. Technologies utilisées](#2-technologies-utilisées)
  - [2.1 Outils de développement](#21-outils-de-développement)
  - [2.2 Librairies et Frameworks](#22-librairies-et-frameworks)

- [3. Architecture du projet](#3-architecture-du-projet)
  - [3.1 Organisation générale](#31-organisation-générale)
  - [3.2 Arborescence des dossiers](#32-arborescence-des-dossiers)

- [4. Installation du projet](#4-installation-du-projet)
  - [4.1 Prérequis](#41-prérequis)
  - [4.2 Installation des dépendances](#42-installation-des-dépendances)
  - [4.3 Configuration des variables d’environnement](#43-configuration-des-variables-denvironnement)
  - [4.4 Initialisation de la base de données](#44-initialisation-de-la-base-de-données)
  - [4.5 Lancement du serveur en mode développement](#45-lancement-du-serveur-en-mode-développement)

- [5. Tests](#5-tests)
  - [5.1 Tests manuels](#51-tests-manuels)
  - [5.2 Tests automatisés](#52-tests-automatisés)

- [6. Documentation de l’API](#6-documentation-de-lapi)
  - [6.1 Authentification](#61-authentification)
  - [6.2 Collections](#62-collections)
  - [6.3 Flashcards](#63-flashcards)
  - [6.4 Utilisateurs (Admin)](#64-utilisateurs-admin)

- [7. Modèle de données](#7-modèle-de-données)
  - [7.1 Schéma entité–relation](#71-schéma-entité–relation)
  - [7.2 Présentation générale](#72-présentation-générale)
  - [7.3 Description des tables](#73-description-des-tables)
  - [7.4 Répétition espacée](#74-répétition-espacée)

- [8. Auteurs](#8-auteurs)



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
├── endpoints.pdf #fichier pdf de la description de tous les endpoints
├── jest.config.cjs # Configuration Jest
├── jest.setup.js # Setup des tests Jest
├── mld.pdf #fichier pdf du mld
├── mld.png #fichier png du mld
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

Cette documentation de l’ensemble des endpoints de l’API est aussi disponible sous un fichier pdf : [Voir ici (PDF)](./endpoints.pdf)

---

### 6.1 Authentification

Les endpoints d’authentification permettent la création de compte, la connexion et la récupération des informations de l’utilisateur connecté.  
L’authentification repose sur des JSON Web Tokens (JWT) transmis via l’en-tête `Authorization`.

---

### POST /auth/register

**Description**  
Crée un nouveau compte utilisateur.

**Authentification requise**   
Aucune.

**Middleware**  
Aucun.

**Validation (Zod)**  
- `email` : string valide au format email  
- `firstname` : string de taille entre 3 et 30 caractères
- `lastname` : string de taille entre 3 et 30 caractères 
- `password` : string de taille entre 6 et 255 caractères


**Headers**  
Aucun.

**Paramètres**  
Aucun.

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

**Middleware**  
Aucun.

**Validation (Zod)**  
- `email` : string valide au format email  
- `password` : string non vide de taille entre 6 et 255 caractères

**Headers**    
Aucun.

**Paramètres**   
Aucun.

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

**Validation (Zod)**  
Aucun. 

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**  
Aucun.

**Body attendu**   
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

### 6.2 Collections

Les endpoints Collections permettent de créer, consulter, modifier, supprimer et rechercher des collections de flashcards.  
Toutes les routes nécessitent **un utilisateur authentifié** via JWT.

---

### POST /collections/createCollection

**Description**  
Crée une nouvelle collection de flashcards.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateBody` : valide le corps de la requête.

**Validation (Zod)**  
- `title` : string non vide de taille max 100.
- `description` : string non vide de taille max 512.
- `is_private` : boolean (optionnel).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**  
Aucun.

**Body attendu**
```json
{
  "title": "Ma nouvelle collection",
  "description": "Description de ma collection.",
  "is_private": false
}
```

**Réponse – Succès (201)**
```json
{
  "message": "Question created",
  "data": {
    "id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
    "title": "Ma nouvelle collection",
    "description": "Description de ma collection.",
    "user_id": "fca23035-97e9-4007-a296-9e8532183906",
    "is_private": false,
    "created_at": "2024-01-09T10:00:00.000Z",
    "updated_at": "2024-01-09T10:00:00.000Z"
  }
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod).
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `500 Internal Server Error` : erreur interne du serveur.

---

### PATCH /collections/updateCollection/:id

**Description**  
Modifie une collection existante (titre, description, visibilité).

**Authentification requise**  
Oui — JWT valide, et propriétaire de la collection ou admin.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateParams` : valide les paramètres de la route.
- `validateBody` : valide le corps de la requête.

**Validation (Zod)**  
- `id`: UUID (paramètre de route).
- `title` : string non vide de taille max 100 (optionnel).
- `description` : string non vide de taille max 512 (optionnel).
- `is_private` : boolean (optionnel).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` (route param, UUID) : identifiant de la collection.

**Body attendu**
```json
{
  "title": "Titre mis à jour"
}
```

**Réponse – Succès (200)**
```json
{
  "message": "Collection mise à jour",
  "data": {
    "id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
    "title": "Titre mis à jour",
    "description": "Description de ma collection.",
    "user_id": "fca23035-97e9-4007-a296-9e8532183906",
    "is_private": false,
    "created_at": "2024-01-09T10:00:00.000Z",
    "updated_at": "2024-01-09T10:05:00.000Z"
  }
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod).
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `403 Forbidden` : l'utilisateur n'est pas le propriétaire ou un admin.
- `404 Not Found` : collection non trouvée.
- `500 Internal Server Error` : erreur interne du serveur.

---

### GET /collections/collectionById/:id

**Description**  
Récupère une collection par son identifiant.

**Authentification requise**  
Oui — JWT valide. Accès autorisé si la collection est publique, ou si l'utilisateur est propriétaire ou admin.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id`: UUID (paramètre de route).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` (route param, UUID) : identifiant de la collection.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
{
  "id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
  "title": "Ma collection",
  "description": "Description de ma collection.",
  "user_id": "fca23035-97e9-4007-a296-9e8532183906",
  "is_private": false,
  "created_at": "2024-01-09T10:00:00.000Z",
  "updated_at": "2024-01-09T10:00:00.000Z"
}
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `403 Forbidden` : la collection est privée et l'utilisateur n'est pas autorisé.
- `404 Not Found` : collection non trouvée.
- `500 Internal Server Error` : erreur interne du serveur.
---

### GET /collections/collectionFlashcards/:id

**Description**  
Récupère les flashcards d'une collection.

**Authentification requise**  
Oui — JWT valide. Accès autorisé si la collection est publique, ou si l'utilisateur est propriétaire ou admin.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id`: UUID (paramètre de route).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` (route param, UUID) : identifiant de la collection.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
[
  {
    "id": "f1c1b1a1-9f9d-4c8c-9c1c-8d8d1f1c9a0a",
    "front_text": "Recto de la carte",
    "back_text": "Verso de la carte",
    "collection_id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a"
  }
]
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `403 Forbidden` : la collection est privée et l'utilisateur n'est pas autorisé.
- `404 Not Found` : collection non trouvée ou pas de flashcards dans la collection.
- `500 Internal Server Error` : erreur interne du serveur.

---

### GET /collections/collectionByTitle/:title

**Description**  
Recherche des collections publiques par titre. Les collections privées de l'utilisateur sont aussi retournées.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `title`: string non vide de taille max 100 (paramètre de route).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `title` (route param, string) : expression à rechercher dans le titre.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
[
  {
    "id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
    "title": "Ma collection",
    "description": "Description de ma collection.",
    "user_id": "fca23035-97e9-4007-a296-9e8532183906",
    "is_private": false,
    "created_at": "2024-01-09T10:00:00.000Z",
    "updated_at": "2024-01-09T10:00:00.000Z"
  }
]
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `404 Not Found` : aucune collection trouvée.
- `500 Internal Server Error` : erreur interne du serveur.

---

### GET /collections/myCollection

**Description**  
Liste toutes les collections appartenant à l’utilisateur connecté, avec leurs flashcards.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.

**Validation (Zod)**  
Aucune.

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**  
Aucun.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
[
  {
    "id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
    "title": "Ma collection",
    "description": "Description de ma collection.",
    "user_id": "fca23035-97e9-4007-a296-9e8532183906",
    "is_private": false,
    "created_at": "2024-01-09T10:00:00.000Z",
    "updated_at": "2024-01-09T10:00:00.000Z",
    "flashcards": [
      {
        "id": "f1c1b1a1-9f9d-4c8c-9c1c-8d8d1f1c9a0a",
        "front_text": "Recto de la carte",
        "back_text": "Verso de la carte",
        "collection_id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a"
      }
    ]
  }
]
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `404 Not Found` : l'utilisateur n'a aucune collection.
- `500 Internal Server Error` : erreur interne du serveur.

---

### DELETE /collections/deleteCollection/:id

**Description**  
Supprime une collection existante et ses flashcards associées.

**Authentification requise**  
Oui — JWT valide, propriétaire de la collection ou admin.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id` : UUID (paramètre de route).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` (route param, UUID) : identifiant de la collection.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
{
  "message": "Collection deleted !"
}
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `403 Forbidden` : l'utilisateur n'est pas autorisé.
- `404 Not Found` : collection non trouvée.
- `500 Internal Server Error` : erreur interne du serveur.

---

### GET /collections/collection/:collection_id/review

**Description**  
Récupère les flashcards à réviser dans une collection pour l’utilisateur connecté, selon le système de répétition espacée.

**Authentification requise**  
Oui — JWT valide. L'utilisateur doit être le propriétaire de la collection.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT.
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `collection_id` : UUID (paramètre de route).

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `collection_id` (route param, UUID) : identifiant de la collection.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
[
  {
    "id": "f1c1b1a1-9f9d-4c8c-9c1c-8d8d1f1c9a0a",
    "front_text": "Recto de la carte à réviser",
    "back_text": "Verso de la carte à réviser",
    "collection_id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
    "progress_level": 2,
    "last_review": "2024-01-08T10:00:00.000Z",
    "next_review_date": "2024-01-10T10:00:00.000Z"
  }
]
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `403 Forbidden` : l'utilisateur n'est pas autorisé.
- `404 Not Found` : collection non trouvée ou aucune flashcard à réviser.
- `500 Internal Server Error` : erreur interne du serveur.
---

### 6.3 Flashcards

Les endpoints Flashcards permettent de créer, consulter, modifier, supprimer et réviser les flashcards.  
Toutes les routes nécessitent **un utilisateur authentifié** via JWT.

---

### GET /flashcards/:id

**Description**  
Récupère une flashcard par son identifiant.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id` : UUID valide (paramètre de route)

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` (route param, UUID) : identifiant de la flashcard

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
{
  "id": "536cf903-7bd7-4279-9c2b-0c013b4d68f5",
  "front_text": "Paris",
  "back_text": "France",
  "url_front": "https://www.okvoyage.com/wp-content/uploads/2023/10/Paris-en-photos-scaled.jpg",
  "url_back": "https://c8.alamy.com/compfr/g2xyg1/carte-vectorielle-detaillee-de-la-france-et-capitale-paris-g2xyg1.jpg",
  "collection_id": "90d1a062-7570-4f8a-b200-1f67357e3d3d",
  "createdAt": "2026-01-10T10:27:47.000Z"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : flashcard non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### POST /flashcards/

**Description**  
Crée une nouvelle flashcard dans une collection.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `validateBody` : valide le corps de la requête.

**Validation (Zod)**  
- `front_text` : string non vide de taille entre 1 et 512 caractères   
- `back_text` : string non vide de taille entre 1 et 512 caractères   
- `url_front` : url valide optionnel  
- `url_back` : url valide optionnel  
- `collection_id` :  UUID valide - identifiant de la flashcard


**Headers**
- `Authorization: Bearer <token>`

**Paramètres**  
Aucun.

**Body attendu**
```json
{
  "front_text" : "Fabienne",
  "back_text" : "Jort",
  "url_front" : "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FDrapeau_de_la_Bretagne&ved=0CBUQjRxqFwoTCLim_-a3xJEDFQAAAAAdAAAAABAH&opi=89978449",
  "collection_id" : "1dcde502-99b3-4294-809d-5fa854218890"
}
```

**Réponse – Succès (200)**
```json
{
  "message": "Flashcard created",
  "data": {
    "id": "39bbcbb6-7ce3-4822-89d9-c5bced34e5a7",
    "front_text": "Fabienne",
    "back_text": "Jort",
    "url_front": "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FDrapeau_de_la_Bretagne&ved=0CBUQjRxqFwoTCLim_-a3xJEDFQAAAAAdAAAAABAH&opi=89978449",
    "url_back": null,
    "collection_id": "1dcde502-99b3-4294-809d-5fa854218890",
    "createdAt": "2026-01-10T10:59:40.000Z"
  }
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : flashcard non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### DELETE /flashcards/:id

**Description**  
Supprime une flashcard existante.

**Authentification requise**  
Oui — JWT valide, propriétaire ou admin.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id` : UUID valide (paramètre de route)

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` UUID valide : identifiant de la flashcard

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
{
  "message": "Flashcard deleted !"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : flashcard non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### PATCH /flashcards/:id

**Description**  
Modifie une flashcard existante (front, back, URLs).

**Authentification requise**  
Oui — JWT valide, propriétaire ou admin.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `validateParams` : valide les paramètres de la route.
- `validateBody` : valide le corps de la requête.

**Validation (Zod)**  
- `id` : UUID valide (paramètre de route)  
- `front_text` : string non vide de taille entre 1 et 512 caractères optionnel   
- `back_text` : string non vide de taille entre 1 et 512 caractères optionnel   
- `url_front` : url valide optionnel  
- `url_back` : url valide optionnel  
- Il faut au moins un des quatre paramètres soit modifié

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` UUID valide : identifiant de la flashcard

**Body attendu**
```json
{
  "url_front" : "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FDrapeau_de_la_Bretagne&ved=0CBUQjRxqFwoTCLim_-a3xJEDFQAAAAAdAAAAABAH&opi=89978449"
}
```

**Réponse – Succès (200)**
```json
{
  "message": "Flashcard updated !"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : flashcard non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### PATCH /flashcards/revise/:id

**Description**  
Enregistre une révision d’une flashcard et met à jour son niveau et la date de prochaine révision.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `validateParams` : valide les paramètres de la route.
- `validateBody` : valide le corps de la requête.

**Validation (Zod)**  
- `progress_level` : nombre entier entre 1 et 5

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` UUID valide : identifiant de la flashcard

**Body attendu**
```json
{
  "progress_level" : 3
}
```

**Réponse – Succès (200)**
```json
{
  "message": "Progression updated",
  "data": {
    "flashcard_id": "54d1ff1a-decb-4ede-a862-e7f60355972e",
    "user_id": "1d14e53a-354f-4077-b0c9-1af6c5ba24fa",
    "progress_level": 3,
    "last_review": "2026-01-10T11:10:30.000Z",
    "next_review_date": "2026-01-14T11:10:30.000Z"
  }
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : flashcard non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### GET /flashcards/reviewAll

**Description**  
Récupère toutes les flashcards à réviser pour l’utilisateur connecté, toutes collections confondues.

**Authentification requise**  
Oui — JWT valide.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT

**Validation (Zod)**  
Aucune.

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**  
Aucun.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
[
    {
        "id": "f1c1b1a1-9f9d-4c8c-9c1c-8d8d1f1c9a0a",
        "front_text": "Recto de la carte à réviser",
        "back_text": "Verso de la carte à réviser",
        "collection_id": "c1f7a2d1-8e4d-4b8b-8e1e-7d7b0f1c9a0a",
        "progress_level": 2,
        "last_review": "2024-01-08T10:00:00.000Z",
        "next_review_date": "2024-01-10T10:00:00.000Z"
    }
]
```

**Erreurs possibles**
- `401 Unauthorized` : token manquant, expiré ou invalide.
- `404 Not Found` : Aucune flashcard à réviser.
- `500 Internal Server Error` : erreur interne du serveur.

---

### 6.4 Utilisateurs (Admin)

Ces endpoints permettent à un administrateur de gérer les utilisateurs.  
Toutes les routes nécessitent **un JWT valide** et **un rôle admin**.

---

### GET /users

**Description**  
Liste tous les utilisateurs triés par date de création (les plus récents en premier).

**Authentification requise**  
Oui — JWT valide et rôle `admin`.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `isAdmin` : vérifie que l’utilisateur est admin

**Validation (Zod)**  
Aucun.

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**  
Aucun.

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
[
  {
    "id": "1d14e53a-354f-4077-b0c9-1af6c5ba24fa",
    "email": "test@test.com",
    "firstname": "alexandre",
    "lastname": "LeRoy",
    "admin": false,
    "createdAt": "2026-01-10T10:27:47.000Z"
  },
  {
    "id": "44582624-118a-4c3c-8f58-a170c2e00308",
    "email": "test2@test.com",
    "firstname": "Cyprien",
    "lastname": "Duroy",
    "admin": true,
    "createdAt": "2026-01-10T10:27:47.000Z"
  },
  {
    "id": "b7b64bef-6eff-4d6a-b32f-3e412d7cffbd",
    "email": "test3@test.com",
    "firstname": "Louis",
    "lastname": "Martin",
    "admin": false,
    "createdAt": "2026-01-10T10:27:47.000Z"
  }
]
```

**Erreurs possibles** 
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : utilisateur non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### GET /users/:id

**Description**  
Récupère les informations d’un utilisateur spécifique.

**Authentification requise**  
Oui — JWT valide et rôle `admin`.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `isAdmin` : vérifie que l’utilisateur est admin
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id` : UUID valide (paramètre de route)

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` UUID valide : identifiant de la personne

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
{
  "id": "1d14e53a-354f-4077-b0c9-1af6c5ba24fa",
  "email": "test@test.com",
  "firstname": "alexandre",
  "lastname": "LeRoy",
  "admin": false,
  "createdAt": "2026-01-10T10:27:47.000Z"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : utilisateur non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

### DELETE /users/:id

**Description**  
Supprime un utilisateur et gère les conséquences sur ses collections et flashcards.

**Authentification requise**  
Oui — JWT valide et rôle `admin`.

**Middleware**
- `authenticateToken` : vérifie la présence et la validité du JWT
- `isAdmin` : vérifie que l’utilisateur est admin
- `validateParams` : valide les paramètres de la route.

**Validation (Zod)**  
- `id` : UUID valide (paramètre de route)

**Headers**
- `Authorization: Bearer <token>`

**Paramètres**
- `id` UUID valide : identifiant de la personne

**Body attendu**  
Aucun.

**Réponse – Succès (200)**
```json
{
  "message": "Utilisateur et toutes ses données associées supprimés avec succès.",
  "userId": "1d14e53a-354f-4077-b0c9-1af6c5ba24fa"
}
```

**Erreurs possibles**
- `400 Bad Request` : données invalides (échec de la validation Zod)
- `401 Unauthorized` : token manquant, expiré ou invalide
- `403 Forbidden` : utilisateur non autorisé
- `404 Not Found` : utilisateur non trouvée
- `500 Internal Server Error` : erreur interne du serveur

---

## 7. Modèle de données

### 7.1 Schéma entité–relation

Le schéma entité–relation ci-dessous représente la structure de la base de données utilisée par l’API.

![Schéma entité–relation](./mld.png)  

Il est également disponible au format PDF : [Voir le schéma entité–relation (PDF)](./mld.pdf)


---

### 7.2 Présentation générale

La base de données est organisée autour de quatre tables principales :

- `users` : gestion des utilisateurs et des rôles
- `collections` : regroupement des flashcards par thématique
- `flashcards` : cartes de révision
- `progression` : suivi personnalisé de la répétition espacée par utilisateur

Ce modèle permet :
- de gérer des collections publiques et privées,
- d’associer des flashcards à des collections,
- d’implémenter une répétition espacée personnalisée pour chaque utilisateur, y compris pour les collections publiques.

---

### 7.3 Description des tables

#### Table `users`

Stocke les informations relatives aux utilisateurs de l’application.

**Champs**
- `id` : identifiant unique de l’utilisateur (clé primaire)
- `email` : adresse email unique
- `firstname` : prénom
- `lastname` : nom
- `password` : mot de passe haché
- `admin` : booléen indiquant si l’utilisateur est administrateur
- `created_at` : date de création du compte

**Relations**
- Un utilisateur peut posséder plusieurs collections
- Un utilisateur peut avoir plusieurs progressions de révision

---

#### Table `collections`

Représente les collections de flashcards créées par les utilisateurs.

**Champs**
- `id` : identifiant unique de la collection (clé primaire)
- `title` : titre de la collection
- `description` : description de la collection
- `user_id` : identifiant du propriétaire (clé étrangère vers `users`)
- `is_private` : indique si la collection est privée ou publique
- `created_at` : date de création

**Relations**
- Une collection appartient à un utilisateur
- Une collection contient plusieurs flashcards

---

#### Table `flashcards`

Contient les cartes de révision associées à une collection.

**Champs**
- `id` : identifiant unique de la flashcard (clé primaire)
- `front_text` : contenu du recto
- `back_text` : contenu du verso
- `url_front` : URL optionnelle pour le recto
- `url_back` : URL optionnelle pour le verso
- `collection_id` : identifiant de la collection (clé étrangère)
- `created_at` : date de création

**Relations**
- Une flashcard appartient à une collection
- Une flashcard peut être révisée par plusieurs utilisateurs

---

#### Table `progression`

Gère la répétition espacée de manière personnalisée pour chaque utilisateur et chaque flashcard.

**Champs**
- `flashcard_id` : identifiant de la flashcard (clé étrangère)
- `user_id` : identifiant de l’utilisateur (clé étrangère)
- `progress_level` : niveau de progression (1 à 5)
- `last_review` : date de la dernière révision
- `next_review_date` : date prévue pour la prochaine révision

**Rôle**
- Permet à plusieurs utilisateurs de réviser une même flashcard avec une progression différente
- Rend possible la révision personnalisée des collections publiques
- Supporte le système de répétition espacée

---

### 7.4 Répétition espacée

Le système de répétition espacée repose sur cinq niveaux de progression :

| Niveau | Délai avant la prochaine révision |
|------|-----------------------------------|
| 1 | 1 jour |
| 2 | 2 jours |
| 3 | 4 jours |
| 4 | 8 jours |
| 5 | 16 jours |

À chaque révision :
- le `progress_level` est mis à jour,
- la date `last_review` est enregistrée,
- la `next_review_date` est recalculée en fonction du niveau atteint.

---

## 8. Auteurs

Ce projet a été réalisé dans le cadre du cours **R5.05 – Projet de groupe**, encadré par **M. Clément Catel** :   
- Github : `ClementCatel`  
- Email : `clement.catel@unicaen.fr`
- Sujet : `https://clementcatel.notion.site/R5-05-Projet-de-groupe-2ae3b8266dbb8014b0aac3869c316f7c` 

Réalisé par : 

- **Duroy Cyprien** – Github : `6pri2` – Email : `cyprien.duroy@etu.unicaen.fr`  
- **Alexandre Le Roy** – Github : `z0ralex` – Email : `alexandre.leroy01@etu.unicaen.fr`  