axios = require('axios')

var exports = module.exports = {};

exports.getGrades = (callback) => {
    axios.get('https://www.myefrei.fr/api/extranet/student/queries/student-courses-semester?semester=S6&year=2017-2018',
    {headers: {'Cookie': '_ga=GA1.2.23140200.1518874967; _gid=GA1.2.1252162977.1522675444; _gat=1; SESSION=0ca00832-6a61-4109-83a1-2c4b98ee9b4b; XSRF-TOKEN=3b0d7a81-7fe4-44cc-a3bb-970a3e3951e6'
    }})
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

exports.getPlanningDay = (day,callback) => {
  axios.get('https://www.myefrei.fr/api/extranet/student/queries/planning?enddate=2018-05-07&startdate=2018-03-26',
  {headers: {'Cookie': '_ga=GA1.2.23140200.1518874967; _gid=GA1.2.1252162977.1522675444; _gat=1; SESSION=0ca00832-6a61-4109-83a1-2c4b98ee9b4b; XSRF-TOKEN=3b0d7a81-7fe4-44cc-a3bb-970a3e3951e6'
  }})
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
  exports.getPlanningDay( '2018-04-03', function (result) {
    result.forEach(item => {
        console.log(item);
    })
});
}

