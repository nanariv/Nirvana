function checkPaymentLogin() {
    var element = document.getElementById("loginNav");
    var temp = sessionStorage.getItem('loginTemp')
    temp == "true" ? element.classList.add("hide") : null;
    var element2 = document.getElementById("logoutNav");
    temp == "true" ? element2.classList.remove("hide") : null;
  }
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  var orderDate;
  var Return;
  var ShippingAddress;
  var Region;
  var PaymentMode;
  function placeOrder() {
    var sendCustomerID = sessionStorage.getItem('cID');
    getOrderInput = {
      "customerId": sendCustomerID
    }
    var test = JSON.parse(sessionStorage.getItem('cartArray'));
    //document.getElementById('payment-form').reset();
    var paymentDetails = {
      "CustomerID": sessionStorage.getItem('cID'),
      "OrderDate" : today,
      "Return" : "0",
      "ShippingAddress" : $('#address').val(),
      "Region": $(".region:checked").val(),
      "PaymentMode" : $(".card:checked").val(),
      "Products" : test
    }
    console.log()
    fetch(urlPathname + "/updateBillingDetails", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(paymentDetails),
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
      .then(function (response) {
        if (response.status !== 200) {
          loginTemp = false; 
          console.log(`Looks like there was a problem. Status code: ${response.status}`);
          var element = document.getElementById("feedbackError");
          element.classList.remove("hide")
          return;
        }
        response.text().then(function () {
          var element = document.getElementById("feedback");
          element.classList.remove("hide")
          setTimeout(redirectHome, 4000);
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
function redirectHome() {
  window.location.href = pathname+"/home.html";
}
function contactNav() {
  window.location.replace(pathname+'/contact.html');
}
function orders() {
window.location.replace(pathname+'/orders.html');
}
function aboutNav() {
  window.location.replace(pathname+'/about.html');
}