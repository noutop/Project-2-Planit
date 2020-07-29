document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


// personal page js 

// calendar function
function init() {
  scheduler.config.server_utc = true;

  // scheduler.config.xml_date = "%Y-%m-%d %H:%i %P";
  scheduler.init("scheduler_here", new Date(), "month");
  // enables the dynamic loading
  scheduler.setLoadMode("day");

  // load data from backend
  scheduler.load("/data", "json");

  // connect backend to scheduler
  var dp = new dataProcessor("/data");
  // set data exchange mode
  dp.init(scheduler);
  dp.setTransactionMode("POST", false);
  scheduler.parse("/data", "json");
}

// time function
n = new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
m = checkTime(m)
d = checkTime(d)
document.getElementById("date").innerHTML = d + "." + m + "." + y;

function startTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML =
    h + ":" + m + ":" + s;
  let t = setTimeout(startTime, 500);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  }; // add zero in front of numbers < 10
  return i;
}

// it calls when loading the page 
function start() {
  init()
  startTime()
}