const jwt = require('jsonwebtoken');
function checkRoles(roles = []) {
  return (req, res, next) => {
    console.log('here');
    try {
      const token = req.header('x-auth-token');
      if (!token) {
        return res.status(401).send({
          'response': {
            'message': 'Token missing',
          },
        });
      }
      try {
        userRole = jwt.decode(token, process.env.SECRET_KEY).role;
      } catch (error) {
        return res.status(401).send({
          'response': {
            'message': 'Invalid Token',
          },
        });
      }
      if (roles.includes(userRole)) {
        return next();
      }
      return res.status(401).send({
        'response': {
          'message': 'Unauthorized user access',
        },
      });
    } catch (ex) {
      next(ex);
    }
  };
}

module.exports = {
  checkRoles,
};
