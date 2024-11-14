const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '123456', 
    database: 'wings_cafe_inventory' 
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');

});
app.post('/api/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, description, category, price, quantity], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ id: result.insertId, name, description, category, price, quantity });
    });
});
// Get Products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
// Update Product
app.put('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, category, price, quantity } = req.body;
    const query = 'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(query, [name, description, category, price, quantity, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'product updated successfully' });
    });
});
// Delete Product
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'product deleted successfully' });
    });
});
// Endpoint to add a user
app.post('/api/users', (req, res) => {
    const user = req.body;

    const username = user.username;
    const password = user.password;
    const position = user.position;
    const idNumber = user.idNumber;
    const phoneNumber = user.phoneNumber;

    const sql = 'INSERT INTO users VALUES(?,?,?,?,?)';
    db.query(sql,[username,password,position,idNumber,phoneNumber], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...user });
    });
});

// Endpoint to get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    }); 
});

app.listen(5000, () => {
    console.log(`Server running on http://localhost:5001`);
});