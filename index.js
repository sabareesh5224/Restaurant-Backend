const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing

const app = express();
const port = process.env.PORT || 8000;

mongoose.connect('mongodb+srv://sabareesh:sabari123@cluster.klfbq3n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error(err);
    });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(cors());

// Sign up route
app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        
        const results = await user.save();
        const datasending = results.toObject();
        res.send(datasending);
    } catch (e) {
        console.error(e);
        res.status(500).send('Something Went Wrong');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});



//Todo

const DBSchema = new mongoose.Schema({
    todo: { type: String, require: true },
});

const DBModel = mongoose.model('sabari', DBSchema);

app.use(express.json());
app.use(cors());
app.post('/posting', async (req, resp) => {
    try {
        const user = new DBModel(req.body);
        const results = await user.save();
        const datasending = results.toObject();
        //text string
        // converting all datas to obj
        resp.send(datasending);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
}); 

app.get('/getting', async (req, resp) => {
    try {
        const users = await DBModel.find({}, 'todo');
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve user data');
    }
});

app.put('/updating/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const updatedTodo = await DBModel.findByIdAndUpdate(
            id,
            { todo },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Failed to update todo:', error);
        res.status(500).send('Failed to update todo');
    }
});



app.delete('/deleting/:id', async (req, resp) => {
    try {
        const { id } = req.params;

        const result = await DBModel.findByIdAndDelete(id);

        if (!result) {
            return resp.status(404).send('Todo not found');
        }

        resp.send('Todo deleted successfully');
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to delete todo');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
