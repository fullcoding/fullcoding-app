axios = require('axios')

var getGrade = () => {
    axios.get('https://www.myefrei.fr/api/extranet/student/queries/student-courses-semester?semester=S6&year=2017-2018',
    {headers: {'Cookie': '_ga=GA1.2.1752916455.1522520189; _gid=GA1.2.405024129.1522520189; SESSION=4090e30f-47ee-4131-9003-0b4865513b14; XSRF-TOKEN=9e22ccbf-48cc-417a-ba5d-4e815b360b6a'
    }})
  .then(function(response){
    console.log(response.data);
  });  
}


getGrade();