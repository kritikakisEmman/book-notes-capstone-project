# Book Notes

A capstone project from Angela Yu's Web Development Bootcamp. A web app that lets users search for books via the Open Library API, add them to a personal reading list with ratings and reviews, and sort their collection.

## Features

- Search books using the [Open Library API](https://openlibrary.org/developers/api)
- Add books with a rating, review, and date read
- View book covers fetched automatically from Open Library
- Sort your book list by rating, title, or date read
- Delete books from your collection

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Templating:** EJS
- **HTTP Client:** Axios
- **Frontend:** HTML, CSS, Vanilla JS

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kritikakisEmman/book-notes-capstone-project.git
   cd book-notes-capstone-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=book-notes
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. Set up the PostgreSQL database:
   ```sql
   CREATE DATABASE "book-notes";

   CREATE TABLE books (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255),
     work_key VARCHAR(100),
     cover_id VARCHAR(50),
     rating INT CHECK (rating >= 1 AND rating <= 5),
     review TEXT,
     date_read DATE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. Start the server:
   ```bash
   node index.js
   ```

6. Open your browser at `http://localhost:3000`
