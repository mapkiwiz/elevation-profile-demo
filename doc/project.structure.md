# Structure du projet

- doc : documentation

- src/client : code source de l'application :

   - polyfills : polyfills pour ES6
                 et pour la version de Firefox ministère
   
   - lib : dépendances externes
           qui ont été internalisées dans le projet
   
   - data : données de géocodage utilisées par l'application
            pour transformer les codes postaux et les codes communes
            en points
   
   - config : paramétrage de l'application ;
              permet d'injecter les services applicatifs
              qu'on souhaite utiliser en fonction de l'environnement de build
   
   - layers : configuration des fonds de plan  utilisés dans l'application
   
   - tests : points d'entrée pour tester les différentes parties
             de l'application
   
   - app : coeur de l'application

       - services : les "services" qui implémentent l'accès aux API externes
                    et autres fonctions packagées dans leur propre classe Javascript :
                    
                    3 services principaux :

                    1. géocodage des codes communes et codes postaux
                    2. récupération des isochrones du GéoPortail
                    3. calcul automatique des affectations
       
       - reducers : fonctions qui décrivent les actions possibles
                    et les transitions (passage d'un état à l'autre)
                    en fonction des actions
       
       - panels : composants de présentation
                  qui apparaissent comme un panneau
                  en superposition sur la carte à droite de la carte
       
       - layers : les couches de données autres que les fonds de plan
                  qui sont affichées dans la carte (enquêteurs, groupes, isochrones)
       
       - forms : formulaires qui permettent à l'utilisateur
                 de modifier les propriétés des objets
                 
       - shared : composants réutilisables implémentant des fonctionnalités
                  non spécifiques de l'application :
                  
                  * listes
                  * couches cartographiques
                  * upload de fichiers
                  * ...

- webpack.config.js : fichier de configuration
                      pour webpack, l'outil principal de build

- tools : outils de build, tâches gulp 

- refs : scripts SQL pour régénérer les données utilisées par l'application
         à partir des données de data.gouv.fr
         -> README à ajouter

- api : microservice Flask pour produire des tuiles vectorielles ;
        non utilisé dans l'application ;
        
- jetty : application Java pour tester le webjar
          dans un container JEE

- dist/(dev|prod) : répertoires de build