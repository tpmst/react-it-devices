const express = require('express');
const cors = require('cors');

const csvRoutes = require('./routes/csvRoutes');
const fileRoutes = require('./routes/fileRoutes');
const druckerRoutes = require('./routes/druckerRoutes');
const einkaufRoutes = require('./routes/einkaufRoutes');
const configRoutes = require('./routes/configRoutes')


const { login } = require('./middleware/authMiddleware');





const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

app.use(express.json());

app.post('/login', login)

app.use(configRoutes)
app.use(csvRoutes);
app.use(fileRoutes);
app.use(druckerRoutes);
app.use(einkaufRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
