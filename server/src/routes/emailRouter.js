const { Router } = require('express');
const sendEmailHandler = require('../handlers/sendEmail');

const router = Router();

// POST /email
router.post('/', sendEmailHandler);

module.exports = router;
