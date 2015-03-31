var express=require('express');
var moment=require('moment');
var mysql=require('mysql2');

//Instantiate a global Object
var obj = {st: 0, et: 0, off: 0, ln: 0};

//Open a mysql connection
var connection = mysql.createConnection({
   user: 'root',
   password: 'donkeyballs',
   host: 'localhost',
   database: 'tz'
});

//make an instance of the express module
var app=express(); 

//routes
app.get('/', function(req,res){
       res.send('Welcome to Time Matrix');  // changed index.html to form.html      
  });
app.get('/:lednumber', ledState);
app.get('/:lednumber/timezone/:timezonenumber', setTimeZone); 
app.get('/:lednumber/on/:beginningtime', setBeginningTime); 
app.get('/:lednumber/off/:endtime', setEndTime); 


//helper functions and route callbacks 
function getOffsetHours(num0to24){
    offset = num0to24 - 12;  
    console.log("The offset number is: " + offset);
    return offset;
}

function parseDBtimes(st, et){
    startHour=parseInt(st.substr(0,2));
    startMin=parseInt(st.substr(2,2)); 
    endHour=parseInt(et.substr(0,2));
    endMin=parseInt(et.substr(2,2)); 

    return [{sr: {hour: startHour, minute: startMin}, er: {hour: endHour, minute: endMin}}];
}

function compareTime(dbobj){
    now = moment().utc();
    nowHrs = now.hours();
    nowMins = now.minutes();

    offsetHrs = nowHrs + getOffsetHours(dbobj.off);
    console.log("The current Hrs offset is: " + offsetHrs);
    
    if (offsetHrs >= 24){
        offsetHrs -= 24;
        console.log("The adjusted Hrs offset is: " + offsetHrs); 
    }

    timezoneTime = moment({hour: offsetHrs, minute: nowMins});
    console.log("The time in timezone " + dbobj.ln + " is: " + timezoneTime.format());

    parsedTimes = parseDBtimes(dbobj.st, dbobj.et);
    
    startRange = moment(parsedTimes[0].sr);
    endRange = moment(parsedTimes[0].er);
   
    console.log("The on time set for this tz is: " + startRange.format());
    console.log("The off time set for this tz is " + endRange.format());


    if (endRange.isBefore(startRange)){
        answer = timezoneTime.isBefore(endRange);
        answer2 =timezoneTime.isAfter(startRange);
        if (answer || answer2){
            myInt = 1;
            }
        else {
            myInt = 0; 
        }
    }

    else {
    answer = timezoneTime.isBetween(startRange, endRange);
    myInt = (answer) ? 1 : 0;
    }
    return myInt;
}

function ledState(req,res){  
    var LEDNumber= req.params.lednumber;
    connection.query('select * from userdata where LED_Position = "'+ LEDNumber +'"', function(err, rows){
        console.log(rows);
        obj.st = rows[0].Start_Time; 
        obj.et = rows[0].End_Time; 
        obj.off = rows[0].GMT_offset;
        obj.ln = rows[0].LED_Position;
        onoff = compareTime(obj);
        
        console.log("Returning: " + onoff);
        res.send(onoff.toString());
    });
}

function setTimeZone(request,response){ 
    msg = updateDB({lednum : request.params.lednumber, newvalue: request.params.timezonenumber, field: 'GMT_offset'});
    response.send(msg + '\n');
}

function setBeginningTime(request,response){
    msg = updateDB({lednum : request.params.lednumber, newvalue: request.params.beginningtime, field: 'Start_Time'});
    response.send(msg + '\n');
}
         
function setEndTime(request,response){
    msg = updateDB({lednum : request.params.lednumber, newvalue: request.params.endtime, field: 'End_Time'});
    response.send(msg + '\n');
}
                
function updateDB(context){
querystr = "update userdata set " + context.field + " = '" + context.newvalue + "' where LED_Position = '" + context.lednum + "'";
console.log(querystr);
connection.query(querystr, function(err, success){
        console.log("Success changing timezone record.");
        });
return querystr;
}



app.listen(8080, function(){
          console.log("listening on port 8080.");
});
