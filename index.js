import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = 3000;

const db=new pg.Client({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASSWORD,
port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [
  {
    id: 1,
    title: "The Order of the Phoenix",
    author: "J.K. Rowling",
    coverId: "0385472579",
    review: "A long but very immersive book. Darker tone than previous ones.",
    rating: 5,
    dateRead: "2023-11-20",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    coverId: "0735211299",
    review: "Practical and easy to apply. A bit repetitive but useful.",
    rating: 4,
    dateRead: "2024-01-05",
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    coverId: "1455586692",
    review: "Changed the way I think about focus and productivity.",
    rating: 5,
    dateRead: "2024-02-10",
  },
];
let sortingValue="";
app.get("/", async(req, res) => {
try {
    
    let sortingValue=req.query.sortingOptions;
    let orderBy= "rating DESC"

    if (sortingValue==="rating"){
      orderBy="rating DESC"
    }else if(sortingValue==="title")
    {
      orderBy="title ASC"
    }else if(sortingValue==="date"){
      orderBy="created_at ASC"
    }
    
    books=[];
    const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
    books = result.rows.map(row => ({
    id: row.id,
    title: row.title,
    author: row.author,
    rating: row.rating,
    review: row.review,
    coverUrl: row.cover_id
    ? `https://covers.openlibrary.org/b/id/${row.cover_id}-L.jpg`
    : "/images/no-cover.png",
  dateRead: row.created_at,
}));
    
      res.render("index.ejs",{books:books,sortingValue:sortingValue});
  } catch (error) {
    console.error(error);
  }

});

app.get("/search",async(req,res)=>{
  const query=req.query.q;
  console.log(query);
  try {
    const result=await axios.get(`https://openlibrary.org/search.json?q='${query}'&limit=3`);
      const books = result.data.docs.map(book => ({
      title: book.title,
      author: book.author_name?.[0],
      coverId: book.cover_i,
      workKey:book.key
    
      
}));
    res.json(books);
   
  } catch (error) {
    console.log(error);
  }
});

app.get("/add", async (req, res) => {
  const workKey = req.query.work;

  const workRes = await axios.get(
    `https://openlibrary.org${workKey}.json`
  );

  const work = workRes.data;

  let authorName = "Unknown";

  if (work.authors && work.authors.length > 0) {
    const authorKey = work.authors[0].author.key;
    const authorRes = await axios.get(
      `https://openlibrary.org${authorKey}.json`
    );
    authorName = authorRes.data.name;
  }

    res.render("add-book.ejs", {
    book: {
      title: work.title,
      author: authorName,
      work_key: workKey,              // 🔥 ΑΠΑΡΑΙΤΗΤΟ
      cover_id: work.covers?.[0] || null, // 🔥 optional
    },

  });
});

app.post("/add", async(req,res)=>{
 const {
    title,
    author,
    cover_id,
    work_key,
    rating,
    review,
    date_read
  } = req.body;
  try {
    await db.query(
      `INSERT INTO books
      (title, author, work_key, cover_id, rating, review, date_read)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [title, author, work_key, cover_id, rating, review, date_read]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not save book");
  }
  
});

app.get("/update",async(req,res)=>{

});
app.delete("/books/:id",async(req,res)=>{
  try {
    console.log("book id for delete is : "+req.params.id);
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
  
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

