axios = require('axios')
config = require('./config')

var exports = module.exports = {};

exports.getGrades = (callback) => {
    axios.get('https://www.myefrei.fr/api/extranet/student/queries/student-courses-semester?semester=S6&year=2017-2018',
    {headers: {'Cookie': config.cookie}}
    )
  .then(function(response){
    var result = [];
    var newMark;
    response.data.rows.forEach(row => {
      if(row.custMarkCode!="") {
        newMark = row.custExamination+" de "+row.soffOfferingDesc+" : "+row.custMarkCode;
        if(result.indexOf(newMark)<0)
          result.push(newMark);
        } 
    });
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

exports.getPlanningDay = (day,callback) => {
  axios.get('https://www.myefrei.fr/api/extranet/student/queries/planning?enddate=2018-05-07&startdate=2018-03-26',
  {headers: {'Cookie': config.cookie}}
  )
.then(function(response){
  var result = [];
  response.data.rows.forEach(row => {
    if(row.srvTimeCrDateFrom.includes(day)){
      var room = row.srvTimeCrDelRoom.split(",");
      room = 'Bat ' + room[1] + ", " + room[2];
      var timeFrom = row.timeCrTimeFrom.slice(0,2)+"h"+row.timeCrTimeFrom.slice(2,4);
      var timeTo = row.timeCrTimeTo.slice(0,2)+"h"+row.timeCrTimeTo.slice(2,4);
      result.push(row.soffDeliveryMode+" en "+row.prgoOfferingDesc+" de "+timeFrom+" à "+timeTo+" en "+room); 
    }
  });
  callback(result);
  })
}

exports.test = () => {
  var d = new Date().toISOString().split('T')[0];
  exports.getPlanningDay( d, function (result) {
    result.forEach(item => {
        console.log(item);
    })
});
}

