const router = require('express').Router();
const {userGetAll, userGet, userUpdate, userSignup, userSignin} = require('../controllers/userController');
const {checkRoles} = require('../middleware/role');
const {checkUserAccess} = require('../middleware/access');

router.post('/signup', userSignup);
router.post('/signin', userSignin);
router.get('/list', checkRoles(['admin']), userGetAll);
router.put('/:id', checkRoles(['admin', 'worker']), checkUserAccess(), userUpdate);
router.get('/:id', checkRoles(['admin', 'worker']), checkUserAccess(), userGet);


module.exports = router;
