package main

import (
	// afficher message console
	"fmt"
	"log"
	// cree serveur http
	"net/http"
	//fichiers de l app
	"golang-backend/config"
	"golang-backend/handlers"
	// bibliotheque qui cré des routes dynamiques
	"github.com/gorilla/mux"
	// gere la communication via api
	"github.com/rs/cors"
)

func main() {
	// Connexion à la base de données
	config.ConnectDB()
	// fermer auto apres fermeture
	defer config.DB.Close()

	// Initialiser le routeur
	r := mux.NewRouter()

	// Routes API
	r.HandleFunc("/api/articles", handlers.GetArticles).Methods("GET")
	r.HandleFunc("/api/articles/{id}", handlers.DeleteArticle).Methods("DELETE")

	
	r.HandleFunc("/api/articles", handlers.CreateArticle).Methods("POST")
	r.HandleFunc("/api/articles/{id}", handlers.UpdateArticle).Methods("PUT")

	// Routes pour l'authentification
	r.HandleFunc("/api/auth/signup", handlers.SignupHandler).Methods("POST")
	r.HandleFunc("/api/auth/login", handlers.LoginHandler).Methods("POST")

	// Configurer CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Lancer le serveur avec CORS
	fmt.Println("API running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", corsHandler.Handler(r)))
}
