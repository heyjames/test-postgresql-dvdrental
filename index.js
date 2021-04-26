const { Pool } = require('pg');

// In Windows Command Prompt, type:
// SET PASSWORD=thesecret
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dvdrental',
  password: process.env.PASSWORD,
  port: 5432
});

pool.connect((error, client, release) => {
  if (error) {
    console.error('Unexpected error on idle client', error);
    process.exit(-1);
  }
});

async function getMovies() {
  try {
    const queryText = "SELECT * FROM movies ORDER BY movie_id ASC";
    const result = await pool.query(queryText);
    
    console.log(result.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

async function getMovieById(id) {
  if (!id) throw new Error("No id provided");
  
  try {
    const queryText = "SELECT * FROM movies WHERE movie_id = $1";
    const result = await pool.query(queryText, [id]);
    
    console.log(result.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

async function getMovieByTitle(title) {
  if (!title) throw new Error("No title provided");

  try {
    const queryText = "SELECT * FROM movies WHERE title = $1";
    const result = await pool.query(queryText, [title]);
    
    console.log(result.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

async function getMoviesByTitleLike(title) {
  if (!title) throw new Error("No title provided");

  try {
    const queryText = "SELECT * FROM movies WHERE title ILIKE $1";
    const result = await pool.query(queryText, [`%${title}%`]);
    
    console.log(result.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

// Confused on how to properly check if it exists without the race condition 
// specified at https://stackoverflow.com/a/31742830
async function createMovie(title) {
  if (!title) throw new Error("No title provided");

  try {
    const queryText = "INSERT INTO movies (title) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *";
    const results = await pool.query(queryText, [title]);

    console.log(results.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

async function deleteMovieById(id) {
  if (!id) throw new Error("No id provided");

  try {
    const queryText = "DELETE FROM movies WHERE movie_id = $1 RETURNING *";
    const results = await pool.query(queryText, [id]);

    console.log(results.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

async function updateMovieTitleById(id, title) {
  if (!id) throw new Error("No id provided");
  if (!title) throw new Error("No title provided");

  try {
    const queryText = "UPDATE movies SET title = $2 WHERE movie_id = $1 RETURNING *";
    const results = await pool.query(queryText, [id, title]);

    console.log(results.rows);
    process.exit();
  } catch (error) {
    console.error("My error", error.message);
    process.exit(-1);
  }
}

// getMovies();
// getMovieById(5);
// createMovie('Intersellar 2');
// getMovieByTitle('Batman Begins 2');
// getMoviesByTitleLike('dark');
// deleteMovieById(17);
// updateMovieTitleById(16, 'Interstellar');

module.exports = {
  getMovies,
  getMovieById,
  getMovieByTitle,
  getMoviesByTitleLike,
  createMovie,
  deleteMovieById,
  updateMovieTitleById
}