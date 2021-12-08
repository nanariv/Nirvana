var path="";
      if (document.currentScript) {
        path= document.currentScript.src;
      } else {
        var scripts = document.getElementsByTagName('script');
        path= scripts[scripts.length - 1].src;
      }
  
  var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
  var urlPathname = "http://127.0.0.1:5000";
  $(document).ready(function(){
    $("#search-value").keydown(function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search-btn").click();
    }
    });
  });

function checkCatalogLogin() {
    var element = document.getElementById("loginNav");
    var temp = sessionStorage.getItem('loginTemp')
    temp == "true" ? element.classList.add("hide") : null;
    var element2 = document.getElementById("logoutNav");
    temp == "true" ? element2.classList.remove("hide") : null;
    catalogLoad();
}
function catalogLoad() {
    
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
function openSearch() {
  checkLogin();
  var searchValue = document.getElementById("search-value").value;
  var entry = {
    "ProductType": searchValue
  };

  fetch(urlPathname + "/searchProduct", {
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
      if(response.status = 404) {
        $("#catalogID").empty();
      var element2 = document.getElementById("error");
      element2.classList.add("show");
    }
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
    $("#catalogID").empty();
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
      template = template + '.jpg" class="product_image" alt="PRODUCT">'
      template = template + '<ul class="product_icons animate"><li><i class="fa fa-shopping-cart" id="';
      template = template + value.ProductID
      template = template + '"></i></li></ul><section><h1 class="title-2">' + value.ProductName + '</h1><span class="price">$' + price + '</span></section></div>';
      colCount++;
      if(colCount == 4) {
        template=template + '</section>'
        colCount = 0;
      }
    })
  $('#catalogID').append(template);
  var temp = sessionStorage.getItem('loginTemp')
  var cartIcon = document.getElementsByClassName("fa-shopping-cart");
    for(var i=0;i<cartIcon.length;i++) {
      temp == "false" || temp == null ? cartIcon[i].classList.add("hide") : null
    }
  var cartEl = document.getElementsByClassName("fa-shopping-cart");
  for (var i = 0; i < cartEl.length; i++) {
    cartEl[i].addEventListener("click", function (event){
      addCart(event.currentTarget.id);
    });
  }
}

function addCart(prodID) {
  var product = {
    "CustomerID" : sessionStorage.getItem('cID'),
    "ProductID" : prodID.toString()
  }
  fetch(urlPathname + "/updateCartDetails", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(product),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
    .then(function (response) {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        alert("Product already in cart!")
        return;
      }
      response.text().then(function () {
        alert("Product added to cart!")
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
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

function cart() {
  window.location.replace(pathname+'/cart.html');
}


  