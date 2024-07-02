const app = require('./app');

const port = 27001;
app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
});