const express=require('express');
const app=express();
require('dotenv').config();
require('./db');
const User=require('./models/user');
const Answer=require('./models/answer');
const Question=require('./models/question');
const Event=require('./models/event');
const UserRoute=require('./routes/userRoutes');
const EventRoute=require('./routes/eventRoutes');
const QuestionRoute=require('./routes/questionRoutes');
const AnswerRoute=require('./routes/answerRoutes');
const bodyParser = require('body-parser');
require('./timeSchedulers/eventhandler');




app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use('/images',express.static('images'));

app.use('/',UserRoute);
app.use('/question',QuestionRoute);
app.use('/event',EventRoute);
app.use('/answer',AnswerRoute);



app.listen(3000,()=>{
    console.log("Connected at port 3000");
})
