require('dotenv').config();
const express = require('express');
const cors = require('cors'); 

const app = express();
 
app.use(cors())   

// this is for test
app.get('/', async (req, res) => { 
    res.status(200).send({
        message: 'Hello from Fillout!'
    })
}); 
// this is for test */
 
app.use('/api/forms', require('./router/forms.router')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API server started on http://localhost:${PORT}`));