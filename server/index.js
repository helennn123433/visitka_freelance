const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')
const server = jsonServer.create()

const loadJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, filePath))
    return JSON.parse(data)
  } catch (error) {
    console.error(`Ошибка загрузки файла ${filePath}:`, error)
    return {}
  }
}

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

server.use(jsonServer.defaults())

server.listen(3004, () => {
  console.log('Сервер запущен на http://localhost:3004')
  console.log('Доступные маршруты:')
  console.log('GET /services')
  console.log('GET /examples')
  console.log('GET /subservices')
  console.log('GET /servicestypes')
  
  console.log('\nЗагруженные данные:')
  console.log('Services:', servicesData.services?.length || 0, 'записей')
  console.log('Examples:', examplesData.examples?.length || 0, 'записей')
  console.log('Subservices:', subservicesData.subservices?.length || 0, 'записей')
  console.log('servicesTypesProjects:', servicesTypesProjectsData.servicesTypesProjects?.length || 0, 'записей')
})