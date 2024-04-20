import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { format } from "path";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "P@ssword$1449",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [];

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM book_detail");
        books = result.rows;
        // console.log(books);
        res.render("index.ejs", {
            bookList: books,
        });
        
    } catch (err) {
        console.error(err);
    }
});

app.post("/detail", async(req, res) =>{
    let feature = []
    const detailid = req.body.detail;
    const id = detailid.slice(-1);
    try {
        const bookNamedetail = await db.query("SELECT title FROM book_detail where id = $1",[id]);
        const bookName = bookNamedetail.rows[0].title;
        const result = await db.query(`SELECT * FROM "${bookName}"`);
        feature =result.rows;
        console.log(feature);
        res.render("detail.ejs", {
            heading: bookName,
            features: feature
        });
        
    } catch (error) {
        console.error(error);
    }
});
   
app.post("/add", (req, res) =>{
    res.render("new_book.ejs");
});

app.post("/submit", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const key1 = req.body.key1;
    const key2 = req.body.key2;

    try {
        // Insert book details into the book_detail table
        await db.query("INSERT INTO book_detail (title, author) VALUES ($1, $2)", [title, author]);

        // Create a table for the book
        await db.query(`CREATE TABLE "${title}" (id serial PRIMARY KEY, content text)`);

        // Insert content into the created table
        await db.query(`INSERT INTO "${title}" (content) VALUES ($1), ($2)`, [key1, key2]);

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, ()=>{
    console.log(`listening at port ${port}`);
});