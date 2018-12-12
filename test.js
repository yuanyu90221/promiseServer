service.get("/api/:domainName", function(req, res) {
    const timeout = 2000; 
    // resolver
    // .resolve(`${req.params.domainName}`)
    // .then(addresses => {
    //   res.send({
    //     status: "passed"
    //   });  
    // })
    // .catch(function(error) {
    //   if (error.code === "ENOTFOUND") {
    //     res.send({
    //       status: "failed"
    //     });
    //   }
    // });
    PromiseResolver(`${req.params.domainName}`, resolver.resolve, timeout)
    .then(addresses => {
      res.send({
        status: "passed"
      });  
    }).catch(function(error) {
      if (error.code === "ENOTFOUND") {
        res.send({
          status: "failed"
        });
      } else if (error.code === "TIMEOUT") {
        console.log("Timeout", error.code);
        res.send({
          status: "failed"
        });
      }
    });
});
/**
 * PromiseResolver
 * @param {*} data 原本的data
 * @param {*} handler 原本的promise function
 * @param {*} timeout ms
 */
const PromiseResolver = (data, handler, timeout) => {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(()=> {
      // reject code data
      reject({code: "TIMEOUT"});
    }, timeout);
    handler(data).then(result => {
      clearTimeout(timer);
      resolve(result);
    }).catch(e=>{
      clearTimeout(timer);
      reject(e);
    });
  });
};
