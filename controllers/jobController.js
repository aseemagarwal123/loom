const {job} = require('../models/job');
const {HttpCodes, CustomErrors}=require('../response');
const jwt = require('jsonwebtoken');

async function jobCreate(req, res, next) {
  try {
    const token = req.header('x-auth-token');
    const decoded = jwt.decode(token, 'secretkey');
    req.body.assigned_by = decoded.user_id;
    let jobRegister = new job(req.body);
    jobRegister = await jobRegister.save();
    return res.status(HttpCodes.OK).send({
      'response': {
        'message': 'job created',
        'result': {
          'application': jobRegister,
        },
      },
    });
  } catch (ex) {
    next(ex);
  }
}

async function jobUpdate(req, res, next) {
  try {
    const job_id = req.params.id;
    const jobRegister = await job.findByIdAndUpdate(job_id, {
      $set: req.body,
    }, {
      new: true,
    });
    return res.status(HttpCodes.OK).send({
      'response': {
        'message': 'job updated',
        'result': {
          'job': jobRegister,
        },
        'status': 'verified',
      },
    });
  } catch (ex) {
    next(ex);
  }
}

async function jobGet(req, res, next) {
  try {
    const job_id = req.params.id;
    const jobRegister = await job.findOne({
      _id: job_id,
    });
    if (!jobRegister) {
      return res.status(404).send({
        'response': {
          'message': 'no job found with this id',
          'result': {
            'job': null,
          },
        },
      });
    } else if (jobRegister) {
      return res.status(HttpCodes.OK).send({
        'response': {
          'message': 'job fetched',
          'result': {
            'job': jobRegister,
          },
          'status': 'verified',
        },
      });
    }
  } catch (ex) {
    next(ex);
  }
}

async function jobFetch(req, res, next) {
  try {
    const page = Number(req.query.limit)*(Number(req.query.page)-1) || 0;
    const limit = Number(req.query.limit) || 10;
    const query={};
    if (req.query.worker_id) {
      query.worker_id = Number(req.query.worker_id);
    }
    const jobs = await job.find(query).sort({createdAt: -1})
        .skip(page)
        .limit(limit);
    return res.status(HttpCodes.OK).send({
      'response': {
        'message': 'jobs fetched',
        'result': {
          'jobs': jobs,
          'count': await job.count(query),
        },
      },
    });
  } catch (ex) {
    next(ex);
  }
}

module.exports = {
  jobCreate, jobUpdate, jobGet, jobFetch,
};
