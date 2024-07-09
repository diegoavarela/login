const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/Users');
const app = express();

require('dotenv').config(); // Load environment variables from a .env file into process.env
app.use(express.json());

const users = [];

console.log(process.env.URL_DB);



mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT);})
  .catch(err => console.log(err));

app.get('/users', (req, res) => {
    // Create a new array that excludes the password from each user object
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
});

app.post('/users', async (req, res) => {
    try {
        // Basic validation
        if (!req.body.name || !req.body.password) {
            return res.status(400).send('Name and password are required');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);

        const duplicate = await User.findOne({ name : req.body.name });

        if (duplicate) {
            return res.status(400).send('User already exists');
        }

        // Create a new user in the database
        const result = await User.create({
            name: req.body.name,
            password: hashedPassword
        });

        

        console.log(result);

        // Optionally, return the created user (excluding password)
        const { password, ...userWithoutPassword } = user;
        res.status(201).send(userWithoutPassword);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);

    console.log(user);
    console.log(req.body.name);

    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send('Server error');
    }
}
);

