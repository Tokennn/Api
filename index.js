const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./base.db');

function seedDatabase() {
    db.serialize(() => {
        //cree les tables
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            content TEXT,
            created_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER,
            user_id INTEGER,
            content TEXT,
            created_at TEXT,
            FOREIGN KEY(post_id) REFERENCES posts(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        const now = new Date().toISOString();

        //Creation utilisatuers
        db.run(`INSERT INTO users (first_name, last_name) VALUES (?, ?)`, ["Firstname", "Lastname"]);
        db.run(`INSERT INTO users (first_name, last_name) VALUES (?, ?)`, ["Test", "Test2"]);

        //Test de posts
        db.run(`INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)`, 
            [1, "testpost", "posttest", now]
        );
        db.run(`INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)`, 
            [2, "testpost2", "posttest2", now]
        );

        //Test de commentaires
        db.run(`INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)`,
            [1, 2, "commentaire 1", now]
        );
        db.run(`INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)`,
            [2, 1, "commentaire 2", now]
        );

        //Afficher dans le terminal 
        db.all(`SELECT * FROM users`, (err, users) => {
            if (err) throw err;
            console.log("Users:", users);
        });
        db.all(`SELECT * FROM posts`, (err, posts) => {
            if (err) throw err;
            console.log("Posts:", posts);
        });
        db.all(`SELECT * FROM comments`, (err, comments) => {
            if (err) throw err;
            console.log("Comments:", comments);
        });
    });
}

module.exports = db;

if (require.main === module) {
    seedDatabase();
    // Fermer la base uniquement lors de l'exécution directe de ce fichier
    db.close();
}
