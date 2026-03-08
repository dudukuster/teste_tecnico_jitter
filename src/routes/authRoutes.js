const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Gera um token JWT para autenticação
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Credenciais fixas para fins de demonstração do teste técnico
  if (username !== 'admin' || password !== 'admin123') {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  return res.status(200).json({ token });
});

module.exports = router;
