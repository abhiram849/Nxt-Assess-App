const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

const app = express()

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'nxt_assess',
  port: Number(process.env.DB_PORT || 3306),
})

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'nxt_assess',
})

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)

app.use(express.json())

app.use(
  session({
    name: 'nxt_assess_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
)

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nxt Assess server is running',
  })
})

app.post('/api/register', async (req, res) => {
  try {
    const {username, password} = req.body

    if (!username || !password) {
      return res.status(400).json({
        error_msg: 'Username and password are required',
      })
    }

    const cleanUsername = username.trim()

    if (cleanUsername.length < 3) {
      return res.status(400).json({
        error_msg: 'Username must be at least 3 characters',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error_msg: 'Password must be at least 6 characters',
      })
    }

    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE username = ?',
      [cleanUsername],
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error_msg: 'Username already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [cleanUsername, hashedPassword],
    )

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

app.post('/api/login', async (req, res) => {
  try {
    const {username, password} = req.body

    if (!username || !password) {
      return res.status(400).json({
        error_msg: 'Username and password are required',
      })
    }

    const [users] = await db.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username.trim()],
    )

    if (users.length === 0) {
      return res.status(401).json({
        error_msg: "Username and Password didn't match",
      })
    }

    const user = users[0]

    const passwordMatched = await bcrypt.compare(
      password,
      user.password,
    )

    if (!passwordMatched) {
      return res.status(401).json({
        error_msg: "Username and Password didn't match",
      })
    }

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

module.exports = app