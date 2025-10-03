
const express = require("express");
const db = require("./index");
const app = express();
const PORT = 3000;

app.use(express.json());
// Servir les fichiers statiques depuis ./public
app.use(express.static("public"));

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(rows);
  });
});


app.get("/users/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Utilisateur introuvable" });
    return res.status(200).json(row);
  });
});


app.post("/users", (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name) return res.status(400).json({ error: "first_name et last_name requis" });
  db.run(
    "INSERT INTO users (first_name, last_name) VALUES (?, ?)",
    [first_name, last_name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ id: this.lastID, first_name, last_name });
    }
  );
});


app.get("/posts", (req, res) => {
  db.all(
    `SELECT posts.*, users.first_name, users.last_name 
     FROM posts 
     JOIN users ON posts.user_id = users.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json(rows);
    }
  );
});

app.get("/posts/:id", (req, res) => {
  db.get(
    `SELECT posts.*, users.first_name, users.last_name 
     FROM posts 
     JOIN users ON posts.user_id = users.id
     WHERE posts.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Post introuvable" });
      return res.status(200).json(row);
    }
  );
});


app.post("/posts", (req, res) => {
  const { user_id, title, content } = req.body;
  if (!user_id || !title || !content) return res.status(400).json({ error: "user_id, title, content requis" });
  const created_at = new Date().toISOString();
  db.run(
    "INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)",
    [user_id, title, content, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ id: this.lastID, user_id, title, content, created_at });
    }
  );
});

app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  if (!title && !content) return res.status(400).json({ error: "title ou content requis" });
  db.run(
    `UPDATE posts SET 
      title = COALESCE(?, title),
      content = COALESCE(?, content)
     WHERE id = ?`,
    [title ?? null, content ?? null, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Post introuvable" });
      return res.status(200).json({ updated: this.changes });
    }
  );
});

app.delete("/posts/:id", (req, res) => {
  db.run(
    "DELETE FROM posts WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Post introuvable" });
      return res.status(204).send();
    }
  );
});


app.get("/posts/:id/comments", (req, res) => {
  db.all(
    `SELECT comments.*, users.first_name, users.last_name 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE post_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json(rows);
    }
  );
});


app.post("/comments", (req, res) => {
  const { post_id, user_id, content } = req.body;
  if (!post_id || !user_id || !content) return res.status(400).json({ error: "post_id, user_id, content requis" });
  const created_at = new Date().toISOString();
  db.run(
    "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)",
    [post_id, user_id, content, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ id: this.lastID, post_id, user_id, content, created_at });
    }
  );
});

app.put("/comments/:id", (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content requis" });
  db.run(
    "UPDATE comments SET content = ? WHERE id = ?",
    [content, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Commentaire introuvable" });
      return res.status(200).json({ updated: this.changes });
    }
  );
});

app.delete("/comments/:id", (req, res) => {
  db.run(
    "DELETE FROM comments WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Commentaire introuvable" });
      return res.status(204).send();
    }
  );
});

app.post("/posts/:id/comments", (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ error: "user_id et content requis" });
  const created_at = new Date().toISOString();
  db.run(
    "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)",
    [req.params.id, user_id, content, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ id: this.lastID, post_id: req.params.id, user_id, content, created_at });
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name && !last_name) return res.status(400).json({ error: "first_name ou last_name requis" });
  db.run(
    `UPDATE users SET 
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name)
     WHERE id = ?`,
    [first_name ?? null, last_name ?? null, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Utilisateur introuvable" });
      return res.status(200).json({ updated: this.changes });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  db.run(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Utilisateur introuvable" });
      return res.status(204).send();
    }
  );
});

// Endpoint d'amorçage de la base
app.post("/admin/seed", (req, res) => {
  try {
    if (typeof db.seedDatabase === 'function') {
      db.seedDatabase();
      return res.status(200).json({ ok: true });
    }
    return res.status(500).json({ error: "seedDatabase non disponible" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});



