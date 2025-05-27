const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = 3000
const CONTACTS_FILE = path.join(__dirname, 'contacts.json')

app.use(cors())
app.use(bodyParser.json())

// Получение всех данных
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('Ошибка чтения файла:', error)
    res.status(500).send('Ошибка сервера')
  }
})

// Обновить сразу все данные
app.put('/api/data', async (req, res) => {
  try {
    const { description, contacts } = req.body
    const json = JSON.stringify({ description, contacts }, null, 2)
    await fs.writeFile(CONTACTS_FILE, json, 'utf-8')
    res.status(200).send('Данные обновлены')
  } catch (err) {
    console.error('Ошибка записи файла:', err)
    res.status(500).send('Ошибка сервера')
  }
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
