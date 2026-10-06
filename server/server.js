const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()
const PORT = 5000

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'nxt_assess',
})

// MySQL session store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || '127.0.0.1',
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'nxt_assess',
})

// CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

// JSON body parser
app.use(express.json())

// Server-side session
app.use(
  session({
    name: 'nxt_assess_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nxt Assess server is running',
  })
})

// ======================================================
// REGISTER
// ======================================================

app.post('/api/register', async (req, res) => {
  try {
    const {username, password} = req.body

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({
        error_msg: 'Username and password are required',
      })
    }

    const cleanUsername = username.trim()

    // Validate username
    if (cleanUsername.length < 3) {
      return res.status(400).json({
        error_msg: 'Username must be at least 3 characters',
      })
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        error_msg: 'Password must be at least 6 characters',
      })
    }

    // Check whether username already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE username = ?',
      [cleanUsername],
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error_msg: 'Username already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save user in MySQL
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [cleanUsername, hashedPassword],
    )

    // Create server-side session
    req.session.user = {
      id: result.insertId,
      username: cleanUsername,
    }

    res.status(201).json({
      success: true,
      user: req.session.user,
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error)

    res.status(500).json({
      error_msg: 'Internal server error',
    })
  }
})

// ======================================================
// LOGIN
// ======================================================

app.post('/api/login', async (req, res) => {
  try {
    const {username, password} = req.body

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({
        error_msg: 'Username and password are required',
      })
    }

    const [users] = await db.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username.trim()],
    )

    // User doesn't exist
    if (users.length === 0) {
      return res.status(401).json({
        error_msg: "Username and Password didn't match",
      })
    }

    const user = users[0]

    // Compare password with hashed password
    const passwordMatched = await bcrypt.compare(
      password,
      user.password,
    )

    if (!passwordMatched) {
      return res.status(401).json({
        error_msg: "Username and Password didn't match",
      })
    }

    // Create server-side session
    req.session.user = {
      id: user.id,
      username: user.username,
    }

    res.status(200).json({
      success: true,
      user: req.session.user,
    })
  } catch (error) {
    console.error('LOGIN ERROR:', error)

    res.status(500).json({
      error_msg: 'Internal server error',
    })
  }
})

// ======================================================
// CHECK CURRENT USER
// ======================================================

app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      authenticated: false,
    })
  }

  res.json({
    authenticated: true,
    user: req.session.user,
  })
})

// ======================================================
// LOGOUT
// ======================================================

app.post('/api/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.error('LOGOUT ERROR:', error)

      return res.status(500).json({
        error_msg: 'Logout failed',
      })
    }

    res.clearCookie('nxt_assess_session')

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  })
})

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log(`Nxt Assess server running on http://localhost:${PORT}`)
})