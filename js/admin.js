var path="";
      if (document.currentScript) {
        path= document.currentScript.src;
      } else {
        var scripts = document.getElementsByTagName('script');
        path= scripts[scripts.length - 1].src;
      }

  var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
  var urlPathname = "http://127.0.0.1:5000";
  function checkLogin() {
    var element = document.getElementById("loginNav");
    var temp = sessionStorage.getItem('loginTemp')
    temp == "true" ? element.classList.add("hide") : null;
    var element2 = document.getElementById("logoutNav");
    temp == "true" ? element2.classList.remove("hide") : null;
  }
  function logout() {
    var element = document.getElementById("loginNav");
    var element2 = document.getElementById("logoutNav");
    sessionStorage.setItem('loginTemp', true);
    sessionStorage.setItem('cID', "true");
    element.classList.remove("hide");
    element2.classList.add("hide");
    window.location.href = pathname+"/login.html";
}
function insertProd() {
    var input = {
        "ProductID" : $('#prodID').val(),
        "ProductName" : $('#prodName').val(),
        "ProductType" : $('#prodType').val(),
        "CostPrice" : $('#cPrice').val(),
        "SellingPrice" : $('#sPrice').val(),
        "Color" : $('#color').val()
    }
    fetch(urlPathname + "/insertProductDetails", {
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
          alert("Product Already Exist!")
          console.log(`Looks like there was a problem. Status code: ${response.status}`);
          return;
        }
        response.text().then(function () {
          alert("Product added");
          catalog();
        });
      })
      .catch(function (error) {
        console.log("Fetch error: " + error);
      });
}

function updateProd() {
  var input = {
      "ProductID" : $('#prodID').val(),
      "ProductName" : $('#prodName').val(),
      "ProductType" : $('#prodType').val(),
      "CostPrice" : $('#cPrice').val(),
      "SellingPrice" : $('#sPrice').val(),
      "Color" : $('#color').val()
  }
  fetch(urlPathname + "/updateProductDetails", {
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
        alert("Product Doesn't Exist!")
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.text().then(function () {
        alert("Product updated")
        catalog();
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}

function insertSeller() {
  var input = {
      "ProductID" : $('#productID').val(),
      "SellerName" : $('#sellerName').val(),
      "SellerAddress" : $('#sellerAdd').val(),
      "InstockQty" : $('#qty').val(),
      "Region" : $('#region').val()
  }
  fetch(urlPathname + "/insertSellerDetails", {
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
        alert("Seller Already Exists!")
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.text().then(function () {
        alert("Seller added")
        catalog();
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}

function updateSeller() {
  var input = {
      "Seller_ID" : $('#sellerID').val(),
      "ProductID" : $('#productID').val(),
      "Seller_Name" : $('#sellerName').val(),
      "Seller_Address" : $('#sellerAdd').val(),
      "InstockQty" : $('#qty').val(),
      "Region" : $('#region').val()
  }
  fetch(urlPathname + "/updateSellerDetails", {
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
        alert("Seller Cannot be Updated!")
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.text().then(function () {
        alert("Seller Updated")
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}

function deleteSeller() {
  var input = {
      "ProductID" : $('#product1ID').val()
  }
  fetch(urlPathname + "/deleteProductDetails", {
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
        alert("Seller and Product Doesn't Exists!")
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.text().then(function () {
        alert("Seller and Product deleted")
        catalog();
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}

function catalog() {
    
  fetch(urlPathname + "/getAllProducts", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(),
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
        buildCatalog(data);
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });

}
function buildCatalog(data) {
  var colCount = 0;
  var template = '';
  $("#catalog").empty();
  $.each(data, function (key, value) {
    var price = value.UnitCost ? value.UnitCost : value.SellingPrice
    if(colCount == 4 || colCount == 0) {
      template=template + '<section class="Cards">';
    }
    template=template + '<div class="product_card">';
    template=template + '<img id="';
    template = template + value.ProductName + '"';
    template = template + ' src=';
    template = template + '"images/' + value.ProductName;
    template = template + '.jpg" class="product_image" alt="PRODUCT"><section><h1 class="title-2">' + value.ProductName + '</h1><span class="price">$' + price + '</span></section></div>';
    colCount++;
    if(colCount == 4) {
      template=template + '</section>'
      colCount = 0;
    }
  })
$('#catalog').append(template);
}