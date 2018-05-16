axios = require('axios')
config = require('./config')

var exports = module.exports = {};

exports.getGrades = (subject, callback) => {
    axios.get('https://www.myefrei.fr/api/extranet/student/queries/student-courses-semester?semester=S6&year=2017-2018',
    {headers: {'Cookie': config.cookie}}
    )
  .then(function(response){
    var result = [];
    var newMark;

    if(subject) {
      response.data.rows.forEach(row => {
        if(row.custMarkCode!="" && row.soffOfferingDesc.toLowerCase()==subject) {
          newMark = row.custExamination+" de "+row.soffOfferingDesc+" : "+row.custMarkCode;
          if(result.indexOf(newMark)<0)
            result.push(newMark);
          } 
      });
    }
    else {
      response.data.rows.forEach(row => {
        if(row.custMarkCode!="") {
          newMark = row.custExamination+" de "+row.soffOfferingDesc+" : "+row.custMarkCode;
          if(result.indexOf(newMark)<0)
            result.push(newMark);
          } 
      });
    }
    callback(result);
    })
}

exports.getAbsences = (callback) => {
  axios.get('https://www.myefrei.fr/api/extranet/student/queries/student-absences?yearId=2017',
  {headers: {'Cookie': config.cookie}}
  )
.then(function(response){
  var result = [];
  var excusedAbsences = 0;
  response.data.rows.forEach(row => {
      result.push(row)
      if(row.stdAbsExcused=="Oui"){
        excusedAbsences++;
      }
  });
  callback(result, excusedAbsences);
  })
}

exports.getPlanningDay = (d1, d2, callback) => {
  url = 'https://www.myefrei.fr/api/extranet/student/queries/planning?enddate='+d2+'&startdate='+d1;
  console.log(url)
  axios.get(url,
  {headers: {'Cookie': config.cookie}}
  )
.then(function(response){
  console.log(response.data);
  var result = [];
  response.data.rows.forEach(row => {
      var room = row.srvTimeCrDelRoom.split(",");
      room = 'Bat ' + room[1] + ", " + room[2];
      if(row.timeCrTimeFrom.length<4)
        var timeFrom = row.timeCrTimeFrom.slice(0,1)+"h"+row.timeCrTimeFrom.slice(1,3);
      else
        var timeFrom = row.timeCrTimeFrom.slice(0,2)+"h"+row.timeCrTimeFrom.slice(2,4);
      if(row.timeCrTimeTo.length<4)
        var timeTo = row.timeCrTimeTo.slice(0,1)+"h"+row.timeCrTimeTo.slice(1,3);
      else
        var timeTo = row.timeCrTimeTo.slice(0,2)+"h"+row.timeCrTimeTo.slice(2,4);
      result.push(row.soffDeliveryMode+" en "+row.prgoOfferingDesc+" de "+timeFrom+" à "+timeTo+" en "+room); 
  });
  callback(result);
  })
}


