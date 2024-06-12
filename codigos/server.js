const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 8080;

// Configuração do MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'batata22',
    database: 'market'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

app.use(cors());
app.use(bodyParser.json());

// Listar todos os produtos
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Obter produto por ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results[0]);
    });
});

// Criar um novo produto
app.post('/products/create', (req, res) => {
    const { name, price } = req.body;
    db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ status: 'success', id: results.insertId });
    });
});

// Atualizar um produto por ID
app.put('/products/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    db.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ status: 'success' });
    });
});

// Deletar um produto por ID
app.delete('/products/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ status: 'success' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
