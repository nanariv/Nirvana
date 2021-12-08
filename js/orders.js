function checkOrderLogin() {
  var element = document.getElementById("loginNav");
  var temp = sessionStorage.getItem('loginTemp')
  temp == "true" ? element.classList.add("hide") : null;
  var element2 = document.getElementById("logoutNav");
  temp == "true" ? element2.classList.remove("hide") : null;
}
function orders() {
  checkOrderLogin();
    var entry = {
        "customerId": sessionStorage.getItem('cID')
    };
  
    fetch(urlPathname + "/getCustomerOrders", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(entry),
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
      .then(function (response) {
        if (response.status !== 200) {
          $("#order-table").empty();
          var element = document.getElementById("error");
          element.classList.remove("hide");
          console.log(`Looks like there was a problem. Status code: ${response.status}`);
          return;
        }
        response.json().then(function (data) {
          console.log(data);
          var obj = data
          var res = [];  
        for(var i in obj)
            res.push(obj[i]);
            orderTable(data);
        });
      })
      .catch(function (error) {
        console.log("Fetch error: " + error);
      });
}
var path="";
  if (document.currentScript) {
    path= document.currentScript.src;
  } else {
    var scripts = document.getElementsByTagName('script');
    path= scripts[scripts.length - 1].src;
  }

var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
var urlPathname = "http://127.0.0.1:5000";

function orderTable(table) {
 
var col = [];
    for (var i = 0; i < table.length; i++) {
      console.log(table[i])
      if(table[i].Return === "1")
        table[i].Return = 'Cancelled'
        else {
          table[i].Return = 'Placed';
          sessionStorage.setItem('canCancel', true);
        }
        
        for (var key in table[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
var tableHTML = document.getElementById("order-table");
for (var i = 0; i < table.length; i++) {
  
tr = tableHTML.insertRow(-1);
tr.className = "tooltip";
// var span = $('<span />').addClass('tooltiptext').html('Click me!');/
$('<span class="tooltiptext">Click me!</span>').insertAfter($('.tooltip'));

for (var j = 0; j < col.length; j++) {
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = table[i][col[j]];
}
}
openOrderDetails();
}
function logout() {
  var element = document.getElementById("loginNav");
  var element2 = document.getElementById("logoutNav");
  sessionStorage.setItem('loginTemp', false);
  element.classList.remove("hide");
  element2.classList.add("hide");
}
function getOrderDetailsPage(event,i){
  console.log(event.target.parentNode.children[0].innerHTML);
  var orderID = event.target.parentNode.children[0].innerHTML
  sessionStorage.setItem('currentOrder', orderID);
  window.location.href = pathname+"/orderDetails.html";
}
function openOrderDetails() {
  var rowList = document.getElementsByTagName('tr');
  for(var i=1; i< rowList.length; i++) {
    rowList[i].addEventListener("click", function(event) {
      getOrderDetailsPage(event,i);
    });
  }
}
function contactNav() {
  window.location.replace(pathname+'/contact.html');
}

function aboutNav() {
  window.location.replace(pathname+'/about.html');
}
