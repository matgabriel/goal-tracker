import express from 'express'

const router = new express.Router()

router.post('/sessions', (req, res) => {
  const { email = '', password = '' } = req.body
  setTimeout(() => {
    const [prefix] = email.split('@')
    if (prefix.toLowerCase() === String(password).toLowerCase()) {
      res.status(201).json({ status: 'authenticated' })
    } else {
      res.status(401).json({ status: 'authentication failed' })
    }
  }, 500)
})

export default router
