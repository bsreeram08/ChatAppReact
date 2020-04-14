const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Server is Up and Running');
});
router.get('/chat', (req, res) => {
    res.send('Chat has initiated and is running in the server Side');
});
module.exports = router;