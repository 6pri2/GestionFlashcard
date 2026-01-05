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
- Structure modulaire (routes, controllers, services, middlewares)
- Dossier `src/db` pour Drizzle et seeders
- Gestion de l’authentification et des rôles (user / admin)

## 4. Installation du projet
### 4.1 Prérequis
- Node.js >= 18
- npm ou yarn
### 4.2 Installation des dépendances
```bash
npm install
```

## 5. Configuration

### 5.1 Variables d’environnement
L’API nécessite un fichier `.env` pour fonctionner correctement.  
Les variables à définir sont :

- `DB_FILE_NAME` : chemin vers la base SQLite (ex. `file:local.db`)  
- `JWT_SECRET` : clé secrète pour signer les JWT  

### 5.2 Exemple de fichier `.env`
```env
DB_FILE_NAME=file:local.db
JWT_SECRET=001628da30d11a300369f28b20c2b4acbfab0f3182f998fe6454242df9a97d4143849c05cb3d537cea687da723c0c1f73f1c8e1d721dfdf3237f2afc015ae297
```

## 6. Initialisation de la base de données

### 6.1 Génération des tables
Pour créer ou mettre à jour les tables selon le schéma Drizzle :  
npm run db:push

### 6.2 Données de test / seeding
Pour insérer des données de test dans la base :  
npm run db:seed

> ⚠️ Il est recommandé de lancer `db:push` puis `db:seed` avant de démarrer le serveur ou de lancer les tests pour garantir un état cohérent de la base.

---

## 7. Lancement du projet

### 7.1 Mode développement
Pour démarrer le serveur en mode développement avec rechargement automatique :  
npm run dev

### 7.2 Vérification du bon fonctionnement
- Le serveur sera accessible sur le port configuré (ex. http://localhost:3000)  
- Pour visualiser et gérer la base via Drizzle Studio :  
npm run db:studio

---

## 8. Tests

### 8.1 Tests manuels
- Utilisation de Thunderbird ou Postman pour tester les endpoints  
- Vérification des fonctionnalités : inscription, connexion, CRUD collections & flashcards, révision

### 8.2 Tests automatiques
Pour exécuter les tests automatiques :  
npm test

- Utilise **Jest**, **Supertest** et **Babel**  
- Avant de lancer les tests, la base est **réinitialisée et seedée automatiquement** pour garantir un état cohérent  
- Les tests sont exécutés séquentiellement (`--runInBand`) pour éviter les conflits sur SQLite

---

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

---

## 12. Auteurs
- Nom / Prénom / Groupe  
- Mail de contact si nécessaire
