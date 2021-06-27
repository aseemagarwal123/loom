const jwt = require('jsonwebtoken');
const {job} = require('../models/job');
function checkUserAccess() {
  return (req, res, next) => {
    try {
      const id = req.params.id || req.query.worker_id;
      const token = req.header('x-auth-token');
      const decoded = jwt.decode(token, process.env.SECRET_KEY);
      const userRole = decoded.role;
      const userId = decoded.user_id;
      if (!id) {
        if (userRole == 'admin') {
          return next();
        }
        return res.status(401).send({
          'response': {
            'message': 'Unauthorized user access',
          },
        });
      }
      if (userRole == 'admin' || id == userId) {
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

function checkJobAccess() {
  return async (req, res, next) => {
    try {
      const id = req.params.id;
      const token = req.header('x-auth-token');
      const decoded = jwt.decode(token, process.env.SECRET_KEY);
      const userRole = decoded.role;
      const jobObject = await job.findById(id);
      if (!jobObject) {
        return res.status(404).send({
          'response': {
            'message': 'no job found with this id',
            'result': {
              'job': null,
            },
          },
        });
      }
      const workerId = jobObject.worker_id;
      const userId = decoded.user_id;
      if (userRole == 'admin' || workerId == userId) {
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
  checkUserAccess, checkJobAccess,
};
