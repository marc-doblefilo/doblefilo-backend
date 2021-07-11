const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mariadb = require("mariadb/callback");
const GitHub = require("github-api");
const axios = require("axios");

dotenv.config();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


async function getAllRepos(list){
  const promises = list.map(function (item) { 
      return axios.get(item)
          .then(resp => {
              const sortedData = resp.data.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0,3);

              return sortedData
          });
  });

  const result = Promise.all(promises).then(function (repo) { 

    repo = [].concat.apply([], repo); 

    let sortedData = repo.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0,3);

    return sortedData.map(value => {
        return {
          name: value.name,
          description: value.description,
          language: value.language,
          stars: value.stargazers_count
        }
    });
  });

  return result;
}

app.get('/repos', (req, res) => {

  let start_time = new Date().getTime();

  axios.get(`https://api.github.com/users/mark-doblefilo/repos?per_page=100`)
      .then(async resp => {
          const link = resp.headers.link
          if(link){

              const totalPages = parseInt(link.split(",")[1].split(">")[0].split("&page=")[1]) 
              const allRepo = []
              
              for(let i=1; i<totalPages+1; i++){
                  allRepo.push(`https://api.github.com/users/mark-doblefilo/repos?per_page=100&page=${i}`)
              }

              const data = await getAllRepos(allRepo)

              return res.json({"results": data, "Time elapsed since queuing the request(in ms):" : new Date().getTime() - start_time})

          }else{

              let sortedData = resp.data.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0,3);
              
              sortedData = sortedData.map(value => {
                  return {
                      name: value.name,
                      description: value.description,
                      language: value.language,
                      stars: value.stargazers_count
                  }
              })

              return res.json(sortedData)
          }
      })
      .catch(error => {
          res.json({"results": "No such user found! Error: " + error})
      });
})

app.listen(process.env.SERVER_PORT, function () {
  console.log('Listening to: ' + process.env.SERVER_PORT);
});
