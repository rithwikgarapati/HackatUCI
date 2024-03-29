import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());


function opendb() {
    let db = new sqlite3.Database('posts.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message); }
        console.log('Connected to the in-memory SQlite database.');
    });
    return db;
}

function closedb(db) {
     db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
}

let db = opendb();
db.run( `CREATE TABLE IF NOT EXISTS Posts (
        postID text primary key not null, 
        title text not null,
        date text not null,
        likes int not null,
        content text not null
    )`
);
closedb(db);

function postLogger(req, res, next) {
    next();
}
app.use(postLogger);

app.get('/', (req, res) => {
    res.send(path.join(__dirname, '../../Frontend/meddit_frontend/src', 'index.js'));
});

app.post("/login", (req, res) => { 
    let db = opendb();

    let sql = 'SELECT * FROM Posts'; 
    let feed = [];
    db.serialize((callback) => {
        db.each(sql, (err, row) => {
            if(err) {
                console.log(err.message);
            }
            feed.push(row);
        }, function() {
            res.setHeader('Content-Type', 'application/json');
            res.send(feed);
        });
    });

    closedb(db);
});

app.post('/post', (req, res) => {
    let db = opendb();

    var postID = uuidv4();
    var title = req.body['title'];
    var datetime = new Date().toDateString();
    var likes = 0;
    var content = req.body['content'];

    var sql = 'INSERT INTO Posts(postID, title, date, likes, content) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [postID, title, datetime, likes, content], function(err) {
        if(err) {
            return console.log(err);
        }
    });

    sql = 'SELECT * FROM Posts'; 
    let feed = [];
    db.serialize((callback) => {
        db.each(sql, (err, row) => {
            if(err) {
                console.log(err.message);
            }
            feed.push(row);
        }, function() {
            res.setHeader('Content-Type', 'application/json');
            res.send(feed);     

        });
    });
    closedb(db);
});

app.post('/like', (req, res) => {
    let db = opendb();

    var id = req.body['postID'];
    var likes = req.body['likes'];
    let numLikes = Number(likes);
    console.log("numLikes: " + numLikes);
    var isLiked = req.body["isLiked"];

    var modified = 0;
    if(isLiked) {
        modified = 0;
    }
    else {
        modified = 1;
    }

    numLikes += modified;
    console.log(numLikes);

    let update = 'UPDATE Posts SET likes = ' + numLikes + ' WHERE postID = ?';
    var feed = [];
    var sql = `SELECT * FROM Posts WHERE postID = ?`;
    db.serialize((callback) => {
        db.run(update, [id])

        db.each(sql, [id], (err, row) => {
            if(err) {
                console.log(err.message);
            }
            console.log(row);
            feed.push(row)
        }, function() {
            res.setHeader('Content-Type', 'application/json');
            res.send(feed);
        });
    });
    closedb(db);
});

app.post("/expanded", (req, res) => {
    let db = opendb();
    var id = req.body["postID"];
    let sql = 'SELECT * FROM Posts WHERE postID = ?';
    var post = [];

    db.serialize((callback) => {
        db.each(sql,[id], (err, row) => {
            if (err) {
                console.log(err.message);
            }
            post.push(row);
        }, function() {
            res.setHeader('Content-Type', 'application/json');
            res.send(post);
        });
    });
    closedb(db);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



