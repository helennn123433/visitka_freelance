const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')
const server = jsonServer.create()

server.use(jsonServer.defaults())
server.use(jsonServer.bodyParser)

const loadJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, filePath))
    return JSON.parse(data)
  } catch (error) {
    console.error(`Ошибка загрузки файла ${filePath}:`, error)
    return {}
  }
}

const loadContacts = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'contacts.json'), 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Ошибка загрузки contacts.json:', error)
    return { description: '', contacts: [] }
  }
}

const loadAboutUs = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'aboutUs.json'), 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Ошибка загрузки contacts.json:', error)
    return { description: [], contacts: [] }
  }
}

let contactsData = loadContacts()
let aboutUsData = loadAboutUs()

const servicesData = loadJsonFile('services.json')
const examplesData = loadJsonFile('examples.json')
const subservicesData = loadJsonFile('subservices.json')
const servicesTypesProjectsData = loadJsonFile('servicesTypesProjects.json')


server.get('/services', (req, res) => {
  res.jsonp(servicesData.services || [])
})

server.get('/examples', (req, res) => {
  res.jsonp(examplesData.examples || [])
})

server.get('/subservices', (req, res) => {
  res.jsonp(subservicesData.subservices || [])
})

server.get('/servicestypes', (req, res) => {
  res.jsonp(servicesTypesProjectsData.servicesTypesProjects || [])
})

server.get('/contacts', (req, res) => {
  res.json(contactsData)
})

server.put('/contacts', (req, res) => {
  try {
    const { description, contacts } = req.body
    
    if (!description || !contacts) {
      return res.status(400).json({ error: 'Неверный формат данных' })
    }

    const newData = { description, contacts }
    fs.writeFileSync(path.join(__dirname, 'contacts.json'), JSON.stringify(newData, null, 2), 'utf-8')
    contactsData = newData
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Ошибка записи:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

server.get('/aboutUs', (req, res) => {
  res.json(aboutUsData)
})

server.put('/aboutUs', (req, res) => {
  try {
    const { description, stats } = req.body

    if (!description || !stats) {
      return res.status(400).json({ error: 'Неверный формат данных' })
    }

    const newData = { description, stats }
    fs.writeFileSync(path.join(__dirname, 'aboutUs.json'), JSON.stringify(newData, null, 2), 'utf-8')
    contactsData = newData
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Ошибка записи:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

server.use((req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
    setTimeout(() => { contactsData = loadContacts() }, 100)
  }
  next()
})

server.listen(3004, () => {
  console.log('Сервер запущен на http://localhost:3004')
  console.log('Доступные маршруты:')
  console.log('GET /services')
  console.log('GET /examples')
  console.log('GET /subservices')
  console.log('GET /servicestypes')
  console.log('GET /contacts')
  console.log('PUT /contacts')
  console.log('GET /aboutUs')
  console.log('PUT /aboutUs')

  
  console.log('\nЗагруженные данные:')
  console.log('Services:', servicesData.services?.length || 0, 'записей')
  console.log('Examples:', examplesData.examples?.length || 0, 'записей')
  console.log('Subservices:', subservicesData.subservices?.length || 0, 'записей')
  console.log('servicesTypesProjects:', servicesTypesProjectsData.servicesTypesProjects?.length || 0, 'записей')
  console.log('Contacts:', contactsData.contacts?.length || 0, 'записей')
})