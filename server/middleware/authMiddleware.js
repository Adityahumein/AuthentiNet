const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request contains an Authorization header starting with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // The header looks like: "Bearer eyJhbGciOiJIUzI1NiIsIn..."
      // We split by space and take the second index to extract just the token string
      token = req.headers.authorization.split(' ')[1];

      // 2. Cryptographically decode and verify the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Inject the verified user ID directly into the request object (req.user)
      // This passes the user's identity forward to the actual route handler
      req.user = decoded.id;

      // Move out of the middleware and execute the next function in line
      return next();

    } catch (error) {
      console.error(`[JWT Verification Failed]: ${error.message}`);
      return res.status(401).json({ error: 'Not authorized, token signature validation failed' });
    }
  }

  // 4. Edge Case: No token provided at all
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, security token missing from headers' });
  }
};

module.exports = { protect };