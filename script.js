var bookedTime=[];
var maxStart=0; var minEnd=0; //intersectia dintre orarele celor 2 pers
var reqMeetTime=30;
var p1Calendar=[];
var p2Calendar=[];
var sortedBookedTime =[];
var mergedMeetings=[];
function fu(){
    
    var x = document.getElementById("timeSelP1Start").value;
    hourStart1=x[0]+''+x[1];
    minStart1=x[3]+''+x[4];
    x = document.getElementById("timeSelP2Start").value;
    hourStart2=x[0]+''+x[1];
    minStart2=x[3]+''+x[4];
    
    maxStart = Math.max(toNum(hourStart1,minStart1),
                       toNum(hourStart2,minStart2));
    
    
    x = document.getElementById("timeSelP1End").value;
    hourEnd1=x[0]+''+x[1];
    minEnd1=x[3]+''+x[4];
    x = document.getElementById("timeSelP2End").value;
    hourEnd2=x[0]+''+x[1];
    minEnd2=x[3]+''+x[4]; 
    
    minEnd = Math.min(toNum(hourEnd1,minEnd1),
                       toNum(hourEnd2,minEnd2));
    
     p1Calendar.push(toNum(hourStart1,minStart1),toNum(hourEnd1,minEnd1));
     p2Calendar.push(toNum(hourStart2,minStart2),toNum(hourEnd2,minEnd2));
    
    console.log("Interval restrans",maxStart,minEnd);
 document.getElementById("scheduleSetter1").classList.add("disabled");
    document.getElementById("scheduleSetter2").classList.remove("disabled");
}

function toNum(hour,min){
    return parseInt(hour*60)+parseInt(min);
}
function toTime(val){
    return Math.floor(val/60)+":"+val%60;
}
function verify(start, end,p){
    if(end>start){
       if(p==1 && (start<p1Calendar[0] || end>p1Calendar[1]))
           return false;
        if(p==2 && (start<p2Calendar[0] || end>p2Calendar[1]))
           return false;
        return true;
    }
        

    return false;
    
}

function addTask(p){
    var x =document.getElementById("taskSelP"+p+"Start").value;
    var y =document.getElementById("taskSelP"+p+"End").value;
    var hStart=x[0]+''+x[1];
    var mStart=x[3]+''+x[4];
    var hEnd=y[0]+''+y[1];
    var mEnd=y[3]+''+y[4];
    var start = toNum(hStart,mStart);
    var end=toNum(hEnd,mEnd);
    console.log(start,end);
    if(verify(start,end,p)){
        if(start < maxStart){
                bookedTime.push([maxStart,end]); return;
           }
        if(end> minEnd){
            bookedTime.push([start,minEnd]); return ;
        }
        bookedTime.push([start,end]);
        alert("Booked !");

        
    }
    else alert("Invalid times!");    
}

function mergeIntervals(){
    
     sortedBookedTime = bookedTime.sort((a,b)=>{
        if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
    });
    
        const mergedIntervals = [sortedBookedTime[0]];
    
        for(var i=1;i<sortedBookedTime.length;i++){
            const lastMerged=mergedIntervals[mergedIntervals.length-1];
            if(sortedBookedTime[i][0] <= lastMerged[1]){
                lastMerged[1] = Math.max(lastMerged[1],sortedBookedTime[i][1]);
            }
            else{
                mergedIntervals.push(sortedBookedTime[i]);
            }
        }
    return mergedIntervals;
    
}
function generateMeeting(){
    reqMeetTime= document.getElementById("reqMeetTime").value;
    document.getElementById("list").innerHTML="Available times";
    
    if(bookedTime.length==0){alert("No meetings booked you can meet between "+toTime(maxStart)+"0 and "+toTime(minEnd)+"0"); return;}
    mergedMeetings=mergeIntervals();
    var listForPrint = [];
    
       let lastPos = maxStart;
    for(var i =0 ;i <mergedMeetings.length;i++){
        if(mergedMeetings[i][0]-lastPos>=reqMeetTime){
         listForPrint.push(toTime(lastPos)+"->"+toTime(mergedMeetings[i][0]));
        }
        lastPos=mergedMeetings[i][1];
        if(i==mergedMeetings.length-1){
            if(minEnd-mergedMeetings[i][1]>=reqMeetTime){
             listForPrint.push(toTime(mergedMeetings[i][1])+"->"+toTime(minEnd));
            }
        }
    }

    
    
    
    for(var i=0;i<listForPrint.length;i++){
        var node = document.createElement("LI"); 
            var text = listForPrint[i];
            var textnode = document.createTextNode(text);       
node.appendChild(textnode);                       
document.getElementById("list").appendChild(node);
    }
    if(listForPrint.length == 0){
        var node = document.createElement("LI"); 
            var text = toTime(maxStart)+"->"+toTime(minEnd);
            var textnode = document.createTextNode(text);  
            var btn= document.createElement("BUTTON");
                btn.innerHTML="Set Meeting";
//node.appendChild(textnode);                       
document.getElementById("list").appendChild(btn);
    }
    
}