const {user} = require('../models/user');
async function validateJobRegister(req, res, next) {
  try {
    const workerId = Number(req.body.worker_id);
    const workerobject = await user.findOne({id: workerId});
    if (!workerobject) {
      return res.status(404).send({
        'response': {
          'message': 'no worker found with this id',
          'result': {
            'worker': null,
          },
        },
      });
    }
    next();
  } catch (ex) {
    res.status(500).send(ex);
  }
}
module.exports = {
  validateJobRegister,
};
