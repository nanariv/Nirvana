var path="";
      if (document.currentScript) {
        path= document.currentScript.src;
      } else {
        var scripts = document.getElementsByTagName('script');
        path= scripts[scripts.length - 1].src;
      }

  var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
  var urlPathname = "http://127.0.0.1:5000";
function checkCartLogin() {
  var element = document.getElementById("loginNav");
  var temp = sessionStorage.getItem('loginTemp')
  temp == "true" ? element.classList.add("hide") : null;
  var element2 = document.getElementById("logoutNav");
  temp == "true" ? element2.classList.remove("hide") : null;
}
function loadCart() {
  checkCartLogin();
  var cartInput = {
    CustomerID: sessionStorage.getItem('cID')
  };

  fetch(urlPathname + "/getCartDetails", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(cartInput),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
    .then(function (response) {
      if (response.status !== 200) {
        
        alert("Add products to view cart!")
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        buildCart(data);
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });

}

function buildCart(data) {
  $("#cartID").empty();
  var total = 0;
  var priceArray = []
  $.each(data, function (key, value) {
    var prod = {
      ProductID: value.ProductID
    };
    fetch(urlPathname + "/getProductDetails", {
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
        response.json().then(function (cartItem) {
          console.log(cartItem[0]);
          var price = cartItem[0].SellingPrice
          var prodId = cartItem[0].ProductID
          var obj = {
            price: price,
            prodId: prodId
          }
          priceArray.push(obj);
          sessionStorage.setItem('priceArray', JSON.stringify(priceArray))
          total = total + cartItem[0].SellingPrice;

          sessionStorage.setItem('total', total);
          var template = '';
          template = template + '<div class="product_card">';
          template = template + '<img id="';
          template = template + cartItem[0].ProductName + '"';
          template = template + ' src=';
          template = template + '"images/' + cartItem[0].ProductName;
          template = template + '.jpg" class="product_image" alt="PRODUCT">'
          template = template + '<section><span class="title-2">' + cartItem[0].ProductName + '</span><span class="price">$' + price + '</span><input type="text" onchange="updateAmount(event)" class="';
          template = template + cartItem[0].ProductID + '"';
          template = template + 'placeholder="1" /></section></div>';
          $('#cartID').append(template);
        });
      })
      .catch(function (error) {
        console.log("Fetch error: " + error);
      });
  })

  $('#amount').text(sessionStorage.getItem('total'));
}
function updateAmount(event) {
  var inputFields = $('input');
  console.log(event);
  var inputData = {
    "ProductID": event.currentTarget.className.substring(0, $("." + event.currentTarget.className).selector.length),
    "OrderQty": event.currentTarget.value
  }
  fetch(urlPathname + "/checkOrderQty", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(inputData),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
    .then(function (response) {
      if (response.status !== 200) {
        alert("Not enough stock!");
        return;
      }
      response.text().then(function () {
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
  var total = 0;
  var priceArrayCheck = JSON.parse("[" + sessionStorage.getItem('priceArray') + "]")[0];
  for (var i = 0; i < inputFields.length; i++) {
    var qty = $('input')[i].value;
    qty = qty === "" ? 1 : parseInt(qty);
    var nameCheck = inputFields[i].className;
    for (var j = 0; j < priceArrayCheck.length; j++) {
      if (nameCheck === priceArrayCheck[j].prodId) {
        total = total + (qty * priceArrayCheck[j].price);
        break;
      }
    }
  }
  sessionStorage.setItem('total2', total);
  $('#amount').text(sessionStorage.getItem('total2'));
}
function sendPayment() {
  var inputFields = $('input');
  var cartArray = [];
  for (var i = 0; i < inputFields.length; i++) {
    var qty = $('input')[i].value;
    qty = qty === "" ? "1" : qty;
    var id = $('input')[i].className;
    console.log(qty);
    var item = {
      "ProductID": id,
      "OrderQty": qty
    }
    cartArray.push(item);
  }
  sessionStorage.setItem('cartArray', JSON.stringify(cartArray))
  window.location.replace(pathname + '/payment.html');
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
