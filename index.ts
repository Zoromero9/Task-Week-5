import express, { Request, Response, Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app: Application = express();
const PORT: number = 3000;

/* ===== Middleware ===== */
app.use(express.json());

/* ===== Data Model ===== */
interface Book {
  id: number;
  title: string;
  author: string;
}

let books: Book[] = [];

/* ===== Swagger Setup ===== */
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ===== Routes ===== */

// GET all books
app.get('/books', (req: Request, res: Response) => {
  res.status(200).json(books);
});

// POST create new book
app.post('/books', (req: Request, res: Response) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const newBook: Book = {
    id: Date.now(),
    title,
    author,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// DELETE book by id
app.delete('/books/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const initialLength = books.length;

  books = books.filter(book => book.id !== id);

  if (books.length < initialLength) {
    res.status(200).json({ message: 'Buku berhasil dihapus' });
  } else {
    res.status(404).json({ message: 'Buku tidak ditemukan' });
  }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Server API is ready</h1>');
});

/* ===== Start Server ===== */
app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
 console.log(`Swagger: http://localhost:${PORT}/api-docs`)
});
