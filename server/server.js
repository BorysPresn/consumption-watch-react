require('dotenv').config({path: './config.env'})
const express = require('express');
const path = require('path');
const app = express();
const port = 5000; // Вы можете использовать любой доступный порт
const { insertNewUser, checkUser } =  require('./services/dbService.js');
// Middleware для обработки JSON запросов
app.use(express.json());

// API маршруты

//Register
app.post('/register', async (req, res) => {
  try {
    const record = req.body;
    const {success, message, userId, token, initialMileage} = await insertNewUser(record);
    if (success) {
      return res.status(200).json({success, userId, token, initialMileage })
    }
    return res.status(400).json({ success, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Endpoint for logIn
app.post('/login', async (req, res) => {
  try {
    const {success, type, message, userId, token, initialMileage} = await checkUser(req.body);
    
    if(success){
      res.status(200).json({ success, message, userId, token, initialMileage });
    } else {
      res.status(400).json({ success, type, message });
    }
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Обслуживание статических файлов React
app.use(express.static(path.join(__dirname, '..', 'build')));

// Все остальные маршруты должны возвращать ваш React-приложение
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
