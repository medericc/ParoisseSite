Suggestions :
Sécurité des informations sensibles :

Les informations comme le mot de passe de la base de données ou la clé secrète devraient être stockées dans des variables d'environnement plutôt que codées en dur. Par exemple :
go
Copy code
connStr := os.Getenv("DATABASE_URL")
Utilise des packages comme github.com/joho/godotenv pour charger les variables d'environnement à partir d'un fichier .env.