const cron=require('node-cron');
const mongoose=require('mongoose');
const Event=require('../models/event');
const Question=require('../models/question')
//const natural=require('natural');
const hashtag=require('mention-hashtag');
const extract = require('mention-hashtag');

function datetime(){
    const yourDate = new Date()
    return yourDate.toISOString().split('T')[0]
}

// function doStemming(data){ 
//     //var natural = require('natural'); 
//     var tokenizer = new natural.WordTokenizer(); 
//     var tokens = tokenizer.tokenize(data); 
//     stemmer = natural.PorterStemmer(data);
//     var nData = stemmer.stem(tokens); 
//     console.log(nData); 
//     return nData; 
//   } 

function doStemming(data){ 
    var natural = require('natural'); 
    var tokenizer = new natural.WordTokenizer(); 
    var tokens = tokenizer.tokenize(data).toString(); 
    
    var nData = natural.PorterStemmer.stem(tokens); 
    //var Data=natural.PorterStemmer.attach()
    //var nData=Data.tokenizeAndStem()
    //console.log(nData); 
    return nData; 
  } 

 const stopwords = ['?','!','yo','i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','the','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']


  function remove_stopwords(str) {
    res = []
    words = str.split(' ')
    for(i=0;i<words.length;i++) {
       word_clean = words[i].split(".").join("")
       if(!stopwords.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '))
}


const thread_for_event_cleansing=cron.schedule('59 11 * * *',async()=>{
    console.log("running tast for event deactivation");
    await Event.find({Doe:datetime()}).then((docs)=>{
        console.log(docs);
        docs.map((doc)=>{
            doc.isActive=false
        })
        docs.save()
    })

})

// const thread_for_hot_topics=cron.schedule('05 01 * * *',async()=>{
//     console.log("filtering hot topics");
//     await Question.find().exec()
//     .then((docs)=>{
//         docs.map((doc)=>{
//             console.log(doc)
//             //var ndata=doStemming(doc.question)
//             //console.log(ndata)
//             //console.log(remove_stopwords(doc.question));
//             var hashtags=extract(doc.question,'#')

//         })
//     }).catch((err)=>{
//         console.log(err)
//     })

// })

module.exports=thread_for_event_cleansing;