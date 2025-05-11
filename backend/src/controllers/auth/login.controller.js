// backend/controllers/auth/login.controller.js
const db = require('../../utils/database');
const jwt = require('jsonwebtoken'); // You'll need to install this: npm install jsonwebtoken
// You'll also need a password comparison library like bcrypt: npm install bcrypt
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key'; // Store this in .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * @desc    Employee Login
 * @route   POST /api/auth/login
 * @access  Public
 */
module.exports = async (req, res) => {
  const {empId, password} = req.body;

  if (!empId || !password) {
    return res
      .status(400)
      .json({message: 'Missing required field: empId or password'});
  }

  try {
    const employees = await db.query(
      'SELECT EmpID, EmpPasswordHash, EmpRole, CitizenID FROM Employee WHERE EmpID = ?',
      [empId],
    );

    if (employees.length === 0) {
      return res
        .status(401)
        .json({message: 'Invalid employee ID or password.'});
    }

    const employee = employees[0];

    // Compare password
    // The EmpPasswordHash in your sample data looks like Argon2.
    // If you are using Argon2, you'd use an Argon2 library.
    // For this example, I'll assume bcrypt, adjust if you used Argon2 for hashing.
    // If using Argon2:
    // const argon2 = require('argon2');
    // const validPassword = await argon2.verify(employee.EmpPasswordHash, password);

    // Using bcrypt as an example:
    const validPassword = await bcrypt.compare(
      password,
      employee.EmpPasswordHash,
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({message: 'Invalid employee ID or password.'});
    }

    // Generate JWT
    const payload = {
      empId: employee.EmpID,
      role: employee.EmpRole,
      citizenId: employee.CitizenID,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      accessToken,
      tokenType: 'Bearer',
    });
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .json({message: 'An internal server error occurred during login.'});
  }
};
