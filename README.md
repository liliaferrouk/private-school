# HopeSchool - Plateforme Éducative

## Contexte du projet

Ce projet a été réalisé dans le cadre d'une étude technique à l'Université de Grenoble. L'objectif est de monter en compétence sur les technologies React et TypeScript, puis d'appliquer ces connaissances dans le développement d'une application web fonctionnelle. HopeSchool représente l'aboutissement de cette démarche d'apprentissage et de mise en pratique.

## À propos

HopeSchool est une plateforme éducative qui permet aux étudiants de découvrir et de s'inscrire à des cours particuliers adaptés à tous les niveaux.

## Fonctionnalités

- **Catalogue de cours** : Consultez tous les cours disponibles avec possibilité de filtrer par niveau (primaire, secondaire, université)
- **Système d'authentification** : Inscription, connexion et déconnexion des étudiants
- **Inscription aux cours** : Les étudiants connectés peuvent s'inscrire aux cours qui les intéressent
- **Espace étudiant personnalisé** : Accès aux cours suivis et aux notifications
- **Système de témoignages** : Ajout et consultation des avis des utilisateurs

## Technologies utilisées

- React
- TypeScript
- React Router
- CSS Modules

## Installation

Pour installer et exécuter ce projet localement, suivez ces étapes :

```bash
# Cloner le dépôt
git clone https://github.com/liliaferrouk/private-school.git

# Accéder au répertoire du projet
cd private-school

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:5173` (ou l'adresse indiquée dans votre terminal).

## Routes principales
- `/` - Page d'accueil
- `/about` - À propos de HopeSchool et témoignages
- `/courses` - Catalogue des cours (avec filtrage possible)
- `/courses/:id` - Détails d'un cours spécifique
- `/login` - Connexion et inscription
- `/espace-etudiant` - Espace personnel de l'étudiant (protégé)
- `/espace-etudiant/notifications` - Centre de notifications de l'étudiant (protégé)


## Contact

Pour toute question ou suggestion concernant ce projet, n'hésitez pas à me contacter .