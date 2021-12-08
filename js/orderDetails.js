var path = "";
if (document.currentScript) {
  path = document.currentScript.src;
} else {
  var scripts = document.getElementsByTagName('script');
  path = scripts[scripts.length - 1].src;
}

var pathname = path.substr(0, path.lastIndexOf('/', path.lastIndexOf('/')-1));
var urlPathname = "http://127.0.0.1:5000";

function checkLoggedin() {
  var element = document.getElementById("loginNav");
  var temp = sessionStorage.getItem('loginTemp')
  temp == "true" ? element.classList.add("hide") : null;
  var element2 = document.getElementById("logoutNav");
  temp == "true" ? element2.classList.remove("hide") : null;
}
function fetchOrderDetails() {
  checkLoggedin();
  var input = {
    "OrderID": sessionStorage.getItem('currentOrder')
  };
  fetch(urlPathname + "/getOrderDetails", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(input),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
    .then(function (response) {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        sessionStorage.setItem('currentProduct', data[0].ProductID);
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
  billing();
}
function billing() {
  // var name = document.getElementById("email-login").value;
  var entry = {
    "OrderID": sessionStorage.getItem('currentOrder')
  };
  var prod = {
    "ProductID": sessionStorage.getItem('currentProduct')
  };

  fetch(urlPathname + "/getBillingDetails", {
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
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        var obj = data
        var res = [];
        for (var i in obj)
          res.push(obj[i]);
        createTable(data, 'billing-table');
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });

  fetch(urlPathname + "/getSellerDetails", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(prod),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
    .then(function (response) {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        var obj = data
        var res = [];
        for (var i in obj)
          res.push(obj[i]);
        createSellerTable(data, 'delivery-table');
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}
function logout() {
  var element = document.getElementById("loginNav");
  var element2 = document.getElementById("logoutNav");
  sessionStorage.setItem('loginTemp', true);
  element.classList.remove("hide");
  element2.classList.add("hide");
}
function createTable(table, id) {
  var col = [];
  for (var i = 0; i < table.length; i++) {
    for (var key in table[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }
  var tableHTML = document.getElementById(id);
  for (var i = 0; i < table.length; i++) {

    tr = tableHTML.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = table[i][col[j]];
    }
  }
}
function createSellerTable(table, id) {
  var col = [];
  for (var i = 0; i < table.length; i++) {
    for (var key in table[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }
  var tableHTML = document.getElementById(id);
  for (var i = 0; i < table.length; i++) {

    tr = tableHTML.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      if (j != 4) {
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = table[i][col[j]];
      }
    }
  }
}
function cancelOrder() {
  var cid = sessionStorage.getItem('currentOrder');
  var entry = {
    "OrderID": cid
  }
  fetch(urlPathname + "/updateCancelledOrder", {
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
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.text().then(function () {
        alert("Order Cancelled!")
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}
function contactNav() {
  window.location.replace(pathname + '/contact.html');
}
function orders() {
  window.location.replace(pathname + '/orders.html');
}
function aboutNav() {
  window.location.replace(pathname + '/about.html');
}