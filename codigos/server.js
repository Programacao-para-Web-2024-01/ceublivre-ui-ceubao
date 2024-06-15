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

// Middleware para verificar e logar as requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    next();
});

// Listar todos os produtos
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Erro ao listar produtos:', err);
            return res.status(500).json({ error: 'Erro ao listar produtos' });
        }
        res.json(results);
    });
});

// Obter produto por ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao obter produto:', err);
            return res.status(500).json({ error: 'Erro ao obter produto' });
        }
        res.json(results[0]);
    });
});

// Criar um novo produto
app.post('/products/create', (req, res) => {
    const { name, price, description, categoria_idcategoria } = req.body;
    if (!name || !price || !description || !categoria_idcategoria) {
        console.error('Campos faltando:', req.body);
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    db.query('INSERT INTO products (name, price, description, categoria_idcategoria) VALUES (?, ?, ?, ?)', 
        [name, price, description, categoria_idcategoria], (err, results) => {
        if (err) {
            console.error('Erro ao criar produto:', err);
            return res.status(500).json({ error: 'Erro ao criar produto' });
        }
        res.json({ status: 'success', id: results.insertId });
    });
});

// Atualizar um produto por ID
app.put('/products/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, categoria_idcategoria } = req.body;
    if (!name || !price || !description || !categoria_idcategoria) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    db.query('UPDATE products SET name = ?, price = ?, description = ?, categoria_idcategoria = ? WHERE id = ?', 
        [name, price, description, categoria_idcategoria, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
        res.json({ status: 'success' });
    });
});

// Deletar um produto por ID
app.delete('/products/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            return res.status(500).json({ error: 'Erro ao deletar produto' });
        }
        res.json({ status: 'success' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
