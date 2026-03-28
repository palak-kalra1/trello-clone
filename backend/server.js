const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.log("DB Error ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});

// ================= LIST ROUTES =================

// ✅ GET ALL LISTS
app.get("/lists", (req, res) => {
  db.query("SELECT * FROM lists", (err, result) => {
    if (err) {
      console.log("GET LIST ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ✅ ADD LIST
app.post("/lists", (req, res) => {
  const { title } = req.body;

  db.query(
    "INSERT INTO lists (title, board_id, position) VALUES (?, 1, 0)",
    [title],
    (err, result) => {
      if (err) {
        console.log("ADD LIST ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(result);
    }
  );
});

// ✅ DELETE LIST
app.delete("/lists/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM lists WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log("DELETE LIST ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ================= CARD ROUTES =================

// ✅ GET CARDS BY LIST
app.get("/cards/:listId", (req, res) => {
  const { listId } = req.params;

  console.log("FETCH CARDS FOR LIST:", listId);

  db.query(
    "SELECT * FROM cards WHERE list_id = ?",
    [listId],
    (err, result) => {
      if (err) {
        console.log("GET CARDS ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(result);
    }
  );
});

// ✅ ADD CARD
app.post("/cards", (req, res) => {
  const { text, list_id } = req.body;

  db.query(
    "INSERT INTO cards (text, list_id) VALUES (?, ?)",
    [text, list_id],
    (err, result) => {
      if (err) {
        console.log("ADD CARD ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(result);
    }
  );
});

// ✅ DELETE CARD
app.delete("/cards/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cards WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log("DELETE CARD ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ✅ UPDATE CARD (EDIT)
app.put("/cards/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  console.log("UPDATE CARD:", id, text);

  db.query(
    "UPDATE cards SET text = ? WHERE id = ?",
    [text, id],
    (err, result) => {
      if (err) {
        console.log("UPDATE CARD ERROR:", err);
        return res.status(500).json(err);
      }

      console.log("CARD UPDATED SUCCESS ✅");
      res.json(result);
    }
  );
});

// ================= SERVER =================
app.listen(5001, () => {
  console.log("Server running on port 5001 🚀");
});