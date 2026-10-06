const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

async function createUser() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'NxtAssess@2026',
    database: 'nxt_assess',
  })

  const username = 'rahul'
  const password = 'rahul123'

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
  )

  console.log('User created successfully')

  await db.end()
}

createUser().catch(error => {
  console.error('Error:', error.message)
})