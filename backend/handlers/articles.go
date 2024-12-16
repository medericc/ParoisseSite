package handlers

import (
	"encoding/json"
	"log"
	"io"
	"bytes"
	"database/sql"
	"net/http"
	"time"  // Pour gérer l'expiration du token
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v4"
// Pour la gestion des JWT
	"golang-backend/models"
	"github.com/gorilla/mux"
	"golang-backend/config"
	"fmt"
	
)


// loginHandler gère la connexion de l'utilisateur
func LoginHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodPost {
        var creds struct {
            Email    string `json:"email"`
            Password string `json:"password"`
        }

        // Parse la requête JSON
        if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
            log.Println("Erreur de décodage JSON:", err)
            http.Error(w, "Bad request", http.StatusBadRequest)
            return
        }

        // Vérification des champs email et mot de passe
        if creds.Email == "" || creds.Password == "" {
            http.Error(w, "Email et mot de passe sont requis", http.StatusBadRequest)
            return
        }

        // Vérifier si l'email existe dans la base de données
        var storedPassword, role string
        var userID int
        var username string
        err := config.DB.QueryRow("SELECT id, username, password, role FROM users WHERE email = $1", creds.Email).Scan(&userID, &username, &storedPassword, &role)
        if err != nil {
            if err == sql.ErrNoRows {
                http.Error(w, "Email ou mot de passe incorrect", http.StatusUnauthorized)
                return
            }
            log.Println("Erreur lors de la vérification de l'email:", err)
            http.Error(w, "Erreur lors de la vérification de l'email", http.StatusInternalServerError)
            return
        }

        // Vérifier le mot de passe
        if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(creds.Password)); err != nil {
            http.Error(w, "Email ou mot de passe incorrect", http.StatusUnauthorized)
            return
        }

        // Générer un token JWT
        token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
            "user_id":  userID,
            "username": username,
            "email":    creds.Email,
            "role":     role,
            "exp":      time.Now().Add(time.Hour * 24).Unix(),
        })

        // Utilisez jwtSecret pour signer le token
        tokenString, err := token.SignedString([]byte(config.JwtSecret))
        if err != nil {
            log.Println("Erreur lors de la génération du token:", err)
            http.Error(w, "Erreur lors de la génération du token", http.StatusInternalServerError)
            return
        }

        // Retourner la réponse avec le token JWT
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "message": "Connexion réussie",
            "token":   tokenString,
            "user": map[string]interface{}{
                "id":       userID,
                "username": username,
                "email":    creds.Email,
                "role":     role,
            },
        })
    } else {
        http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
    }
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodPost {
        var creds struct {
            Email    string `json:"email"`
            Password string `json:"password"`
            Username string `json:"username"`
        }

        // Parse la requête JSON
        if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
            log.Println("Erreur de décodage JSON:", err)
            http.Error(w, "Bad request", http.StatusBadRequest)
            return
        }

        // Ajoute un log pour voir les données reçues
        log.Printf("Données reçues: email=%s, password=%s, username=%s", creds.Email, creds.Password, creds.Username)

        // Vérification des champs email, mot de passe et username
        if creds.Email == "" || creds.Password == "" || creds.Username == "" {
            log.Println("Email, mot de passe ou pseudo manquant")
            http.Error(w, "Email, mot de passe et pseudo sont requis", http.StatusBadRequest)
            return
        }

        // Hash du mot de passe avant de l'enregistrer
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
        if err != nil {
            log.Println("Erreur de hachage du mot de passe:", err)
            http.Error(w, "Erreur de hachage du mot de passe", http.StatusInternalServerError)
            return
        }

        // Vérifier si l'email existe déjà dans la base de données
        var existingUser struct {
            ID int
        }
        err = config.DB.QueryRow("SELECT id FROM users WHERE email = $1", creds.Email).Scan(&existingUser.ID)
        if err != nil && err != sql.ErrNoRows {
            log.Println("Erreur lors de la vérification de l'email:", err)
            http.Error(w, "Erreur lors de la vérification de l'email", http.StatusInternalServerError)
            return
        }
        if existingUser.ID != 0 {
            log.Println("Email déjà utilisé:", creds.Email)
            http.Error(w, "Cet email est déjà utilisé", http.StatusConflict)
            return
        }

        // Vérifier si le username existe déjà dans la base de données
        err = config.DB.QueryRow("SELECT id FROM users WHERE username = $1", creds.Username).Scan(&existingUser.ID)
        if err != nil && err != sql.ErrNoRows {
            log.Println("Erreur lors de la vérification du pseudo:", err)
            http.Error(w, "Erreur lors de la vérification du pseudo", http.StatusInternalServerError)
            return
        }
        if existingUser.ID != 0 {
            log.Println("Pseudo déjà utilisé:", creds.Username)
            http.Error(w, "Ce pseudo est déjà utilisé", http.StatusConflict)
            return
        }

        // Enregistrer l'utilisateur dans la base de données
        _, err = config.DB.Exec("INSERT INTO users (email, password, username) VALUES ($1, $2, $3)", creds.Email, string(hashedPassword), creds.Username)
        if err != nil {
            log.Println("Erreur lors de l'inscription:", err)
            http.Error(w, "Erreur lors de l'inscription", http.StatusInternalServerError)
            return
        }

        // Retourner une réponse de succès
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Utilisateur créé avec succès"})
    } else {
        log.Println("Méthode non autorisée")
        http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
    }
}


// Fonction pour créer un article
func CreateArticle(w http.ResponseWriter, r *http.Request) {
    log.Println("CreateArticle endpoint hit")

    // Lire et loguer le corps brut de la requête
    body, err := io.ReadAll(r.Body)
    if err != nil {
        log.Println("Error reading request body:", err)
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    log.Println("Raw request body:", string(body))

    // Décoder le corps de la requête en Article
    var article models.Article
    decoder := json.NewDecoder(bytes.NewReader(body))
    if err := decoder.Decode(&article); err != nil {
        log.Println("Error decoding JSON:", err)
        http.Error(w, "Invalid JSON format: "+err.Error(), http.StatusBadRequest)
        return
    }

    // Log des données après décodage
    log.Printf("Decoded article: %+v\n", article)

    // Validation des champs
    if article.Title == "" || article.Content == "" || article.Username == "" || article.CategoryNAME == "" {
        log.Println("Missing required fields in the request")
        http.Error(w, "Missing required fields", http.StatusBadRequest)
        return
    }

    // Log avant l'exécution de la requête SQL
    log.Println("Preparing to execute query:", "INSERT INTO articles (title, content, image_url, published_at, username, category_name) VALUES ($1, $2, $3, $4, $5, $6)")

    // Insertion dans la base de données
    var id int
    err = config.DB.QueryRow("INSERT INTO articles (title, content, image_url, published_at, username, category_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", 
                              article.Title, article.Content, article.ImageURL, article.PublishedAt, article.Username, article.CategoryNAME).Scan(&id)
    if err != nil {
        log.Printf("Error executing query: %v\n", err) // Log détaillé de l'erreur
        http.Error(w, "Error creating article: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Log après insertion réussie
    log.Println("Article inserted successfully with ID:", id)

    // Mise à jour de l'ID de l'article
    article.ID = id

    // Retourner l'article créé
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    if err := json.NewEncoder(w).Encode(article); err != nil {
        log.Println("Error encoding response JSON:", err)
        http.Error(w, "Error encoding response", http.StatusInternalServerError)
    }
}



// Fonction pour récupérer les articles
func GetArticles(w http.ResponseWriter, r *http.Request) {
	// Exécuter la requête pour récupérer les articles depuis la base de données
	rows, err := config.DB.Query("SELECT id, title, content, image_url, published_at, username, category_name  FROM articles")
	if err != nil {
		log.Println("Error retrieving articles:", err)
		http.Error(w, "Error retrieving articles", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var articles []models.Article
	for rows.Next() {
		var article models.Article
		// Scanner les résultats de la requête dans l'objet Article
		if err := rows.Scan(&article.ID, &article.Title, &article.Content, &article.ImageURL, &article.PublishedAt, &article.Username, &article.CategoryNAME,); err != nil {
			log.Println("Error scanning row:", err)
			http.Error(w, "Error processing article data", http.StatusInternalServerError)
			return
		}
		articles = append(articles, article)
	}

	// Vérification si une erreur est survenue pendant l'itération des lignes
	if err := rows.Err(); err != nil {
		log.Println("Error with rows:", err)
		http.Error(w, "Error processing articles", http.StatusInternalServerError)
		return
	}

	// Retourner les articles en réponse
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articles)
}

func DeleteArticle(w http.ResponseWriter, r *http.Request) {
    // Extraire l'ID de l'article depuis les paramètres de la route
    vars := mux.Vars(r)
    id := vars["id"]

    if id == "" {
        log.Println("ID manquant dans la requête")
        http.Error(w, "ID manquant dans la requête", http.StatusBadRequest)
        return
    }

    // Extraire le token JWT de l'en-tête Authorization
    tokenString := r.Header.Get("Authorization")
    if tokenString == "" {
        http.Error(w, "Token manquant", http.StatusUnauthorized)
        return
    }

    // Valider le token JWT
    _, claims, err := validateToken(tokenString) // Ignorer le token
    if err != nil {
        http.Error(w, "Token invalide", http.StatusUnauthorized)
        return
    }

    // Vérifier si l'utilisateur est un admin
    role, ok := claims["role"].(string)
    if !ok || role != "admin" {
        http.Error(w, "Accès interdit. Seuls les administrateurs peuvent supprimer des articles", http.StatusForbidden)
        return
    }

    // Supprimer l'article de la base de données
    result, err := config.DB.Exec("DELETE FROM articles WHERE id = $1", id)
    if err != nil {
        log.Println("Erreur lors de la suppression de l'article :", err)
        http.Error(w, "Erreur lors de la suppression de l'article", http.StatusInternalServerError)
        return
    }

    // Vérifier si un article a été supprimé
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        log.Println("Erreur lors de la vérification de la suppression :", err)
        http.Error(w, "Erreur lors de la suppression", http.StatusInternalServerError)
        return
    }
    if rowsAffected == 0 {
        log.Println("Aucun article trouvé avec l'ID :", id)
        http.Error(w, "Article non trouvé", http.StatusNotFound)
        return
    }

    // Retourner une réponse de succès
    log.Println("Article supprimé avec succès, ID :", id)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Article supprimé avec succès"})
}


func validateToken(tokenString string) (*jwt.Token, jwt.MapClaims, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Vérifier la méthode de signature
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("méthode de signature inattendue")
        }
        return []byte(config.JwtSecret), nil
    })
    if err != nil {
        return nil, nil, err
    }

    // Extraire les informations de l'utilisateur depuis le token
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return token, claims, nil
    }
    return nil, nil, fmt.Errorf("token invalide")
}
func UpdateArticle(w http.ResponseWriter, r *http.Request) {
    // Extraire l'ID de l'article depuis les paramètres de la route
    vars := mux.Vars(r)
    id := vars["id"]

    if id == "" {
        log.Println("ID manquant dans la requête")
        http.Error(w, "ID manquant dans la requête", http.StatusBadRequest)
        return
    }

    // Extraire le token JWT de l'en-tête Authorization
    tokenString := r.Header.Get("Authorization")
    if tokenString == "" {
        http.Error(w, "Token manquant", http.StatusUnauthorized)
        return
    }

    // Valider le token JWT
    _, claims, err := validateToken(tokenString)
    if err != nil {
        http.Error(w, "Token invalide", http.StatusUnauthorized)
        return
    }

    // Extraire les informations de l'utilisateur depuis le token
    username, ok := claims["username"].(string)
    if !ok {
        http.Error(w, "Token invalide : username manquant", http.StatusUnauthorized)
        return
    }
    role, ok := claims["role"].(string)
    if !ok {
        http.Error(w, "Token invalide : rôle manquant", http.StatusUnauthorized)
        return
    }

    // Parse le corps de la requête pour extraire les champs à mettre à jour
    var payload struct {
        Title   string `json:"title"`
        Content string `json:"content"`
    }
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        log.Println("Erreur lors de la lecture du corps de la requête :", err)
        http.Error(w, "Corps de la requête invalide", http.StatusBadRequest)
        return
    }

    // Vérifier si l'article existe et récupérer l'auteur
    var articleAuthor string
    err = config.DB.QueryRow("SELECT username FROM articles WHERE id = $1", id).Scan(&articleAuthor)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Article non trouvé", http.StatusNotFound)
            return
        }
        log.Println("Erreur lors de la récupération de l'article :", err)
        http.Error(w, "Erreur interne", http.StatusInternalServerError)
        return
    }

    // Vérifier les permissions (admin ou auteur de l'article)
    if role != "admin" && articleAuthor != username {
        http.Error(w, "Accès interdit. Vous n'êtes pas autorisé à modifier cet article", http.StatusForbidden)
        return
    }

    // Mettre à jour l'article dans la base de données
    result, err := config.DB.Exec(
        "UPDATE articles SET title = $1, content = $2 WHERE id = $3",
        payload.Title, payload.Content, id,
    )
    if err != nil {
        log.Println("Erreur lors de la mise à jour de l'article :", err)
        http.Error(w, "Erreur lors de la mise à jour de l'article", http.StatusInternalServerError)
        return
    }

    // Vérifier si un article a été mis à jour
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        log.Println("Erreur lors de la vérification de la mise à jour :", err)
        http.Error(w, "Erreur interne", http.StatusInternalServerError)
        return
    }
    if rowsAffected == 0 {
        log.Println("Aucun article trouvé avec l'ID :", id)
        http.Error(w, "Article non trouvé", http.StatusNotFound)
        return
    }

    // Retourner une réponse de succès
    log.Println("Article mis à jour avec succès, ID :", id)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Article mis à jour avec succès"})
}
