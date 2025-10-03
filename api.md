Ressource Users

Endpoints =>

GET /users → liste des utilisateurs
GET /users/:id → un utilisateur précis
POST /users → créer un utilisateur
PUT /users/:id → modifier un utilisateur
DELETE /users/:id → supprimer un utilisateur

Ressource Posts

GET /posts → liste des posts
GET /posts/:id → un post précis
POST /posts → créer un post (lié à un user_id)
PUT /posts/:id → modifier un post
DELETE /posts/:id → supprimer un post

Ressource Comments

GET /posts/:id/comments → liste des commentaires d’un post
POST /posts/:id/comments → créer un commentaire sur un post


{
    id: 1,
    title: "Da supa title",
    content: "The Real Slim Content",
    author: "John Doe"
    comments_count: 17
}