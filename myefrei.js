axios = require('axios')

var getGrade = () => {
    axios.get('https://www.myefrei.fr/api/extranet/student/queries/student-courses-semester?semester=S6&year=2017-2018',
    {headers: {'Cookie': '_ga=GA1.2.1452027106.1516909406; _gid=GA1.2.1665466258.1522742761; _gat=1; SESSION=fee26d6d-e1b2-4c36-be86-d10de1772e0d; XSRF-TOKEN=8e82dd81-3d6a-442d-b8d1-daa4d1136f3f'
    }})
  .then(function(response){
    console.log(response.data);
  });  
}


getGrade();