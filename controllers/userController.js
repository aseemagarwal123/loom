const {user} = require('../models/user');
const {HttpCodes, CustomErrors}=require('../response');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function userSignup(req, res, next) {
  try {
    const userName = req.body.user_name;
    let userObject = await user.findOne({'user_name': userName});
    if (userObject) {
      return res.status(400).send({
        'response': {
          'message': 'user name already taken',
          'result': {'user': null},
        },
      });
    } else if (!userObject) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      userObject = new user(req.body);
      await userObject.save();
      return res.status(400).send({
        'response': {
          'message': 'user successfully registered',
          'result': {'user': userObject},
        },
      });
    }
  } catch (ex) {
    next(ex);
  }
}

async function userSignin(req, res, next) {
  try {
    const userRegister = await user.findOne({user_name: req.body.user_name});
    if (userRegister) {
      const check = await bcrypt.compare(req.body.password, userRegister.password);
      if (!check) {
        return res.status(401).send({'response': {'message': 'login failed invalid credentials'}});
      }
    } else {
      return res.status(401).send({'response': {'message': 'login failed invalid user_name'}});
    }
    const token = jwt.sign({user_id: userRegister.id, role: userRegister.role}, 'secretkey');
    return res.status(200).send({'response': {'message': 'login successful', 'user': userRegister, 'token': token}});
  } catch (ex) {
    next(ex);
  }
}

async function userUpdate(req, res, next) {
  try {
    const user_id = req.params.id;
    let userRegister = await user.findOne({_id: user_id});
    if (!userRegister) {
      return res.status(404).send({
        'response': {
          'message': 'no user found with this id',
          'result': {'user': null},
          'status': 'unregistered',
        },
      });
    } else if (userRegister && userRegister.email_verified) {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      userRegister = await user.findOneAndUpdate({_id: user_id}, {$set: req.body}, {new: true});
      return res.status(HttpCodes.OK).send({
        'response': {
          'message': 'user updated',
          'result': {'user': userRegister},
          'status': 'verified',
        },
      });
    }
    // else if(userRegister && !userRegister.email_verified){
    //   return res.status(HttpCodes.BAD_REQUEST).send({
    //     'response': {
    //       'message': 'user email not verified',
    //       'result': {'user': null},
    //       'status':"verified"
    //     },
    //   });
    // }
  } catch (ex) {
    next(ex);
  }
}

async function userGet(req, res, next) {
  try {
    const user_id = req.params.id;
    const userRegister = await user.findOne({_id: user_id});
    if (userRegister && userRegister.email_verified) {
      return res.status(HttpCodes.OK).send({
        'response': {
          'message': 'user fetched',
          'result': {'user': userRegister},
          'status': 'verified',
        },
      });
    }
  } catch (ex) {
    next(ex);
  }
}

async function userGetAll(req, res, next) {
  try {
    const page = Number(req.query.limit)*((req.query.page)-1) || 0;
    const limit = Number(req.query.limit) || 10;
    query={};
    if (req.query.role) {
      query = {'role': req.query.role};
    }
    const users = await user.find(query).sort({createdAt: -1})
        .skip(page)
        .limit(limit);
    return res.status(HttpCodes.OK).send({
      'response': {
        'message': 'users fetched',
        'result': {
          'users': users,
          'count': await user.count(query),
        },
      },
    });
  } catch (ex) {
    next(ex);
  }
}


module.exports = {
  userGetAll, userSignup, userSignin, userUpdate, userGet,

};
