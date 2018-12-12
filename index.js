const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.listen(4000, (req, res)=> {
  console.log(`server is listen on 4000`);
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.json({msg:'OK'});
});

app.get('/promiseResult', (req, res) => {
  let {query} = req;
  if (query) {
  let {t} = query;
  t = t? t: 2000;
  console.log(`t: ${t}`);
    promiseResolver(Number(t), 'test message', promiseBack, 2000).then((data)=> {
      res.status(200).json(data);
    }).catch(e => {
      // 此處 為reject出來的 error
      console.log(e);
      if (e.code==='timeout') {
        res.status(405).json({error: e.code});
      }
    });
  }
});

const promiseBack = (ms, message)=> {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve({msg:`${ms} ms later, message: ${message}`});
    }, ms);
  });
};
/**
 * promiseResolver
 * 
 * @param {*} t1 
 * @param {*} data 原本執行參數
 * @param {*} handler 原本的Promise function
 * @param {*} ms timeout
 */
const promiseResolver = (t1, data, handler, ms) => {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(()=> {
      reject({code: 'timeout'});
    }, ms);
    handler(t1, data).then((result)=>{
      clearTimeout(timer);
      resolve(result);    
    }).then((e)=> {
      clearTimeout(timer);
      reject(e);
    })
  });
};