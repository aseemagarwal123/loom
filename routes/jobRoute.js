const router = require('express').Router();
const {jobCreate, jobUpdate, jobGet, jobFetch} = require('../controllers/jobController');
const {checkRoles} = require('../middleware/role');
const {checkUserAccess, checkJobAccess} = require('../middleware/access');
const {validateJobRegister} = require('../middleware/validate');

router.post('/', checkRoles(['admin']), validateJobRegister, jobCreate);
router.get('/list', checkRoles(['admin', 'worker']), checkUserAccess(), jobFetch);
router.put('/:id', checkRoles(['admin', 'worker']), checkJobAccess(), jobUpdate);
router.get('/:id', checkRoles(['admin', 'worker']), checkJobAccess(), jobGet);


module.exports = router;
