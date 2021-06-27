const router = require('express').Router();

const jobRoute = require('./routes/jobRoute');
const userRoute = require('./routes/userRoute');

router.use('/api/v1/job', jobRoute);
router.use('/api/v1/user', userRoute);

module.exports = router;