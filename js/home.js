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
    fetchTopProducts();
}
function fetchTopProducts() {
    fetch(urlPathname + "/fetchBestRegion", {
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
        $("#region").html(data[0].region);
        $("#orders").html(data[0].totalOrders);
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
    fetch(urlPathname + "/topProducts", {
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
            buildProd(data)
          });
        })
        .catch(function (error) {
          console.log("Fetch error: " + error);
        });
}
function buildProd(data) {
    var colCount = 0;
    var template = '';
    $("#topBags").empty();
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
      template = template + '<ul class="product_icons animate"><li><</li></ul><section><h1 class="title-2">' + value.ProductName + '</h1><span class="price">$' + price + '</span><span class="qty">Only ' + parseInt(value.TotalQuantity) + ' left!</span></section></div>';
      colCount++;
      if(colCount == 4) {
        template=template + '</section>'
        colCount = 0;
      }
    })
  $('#topBags').append(template);
}
function logout() {
    var element = document.getElementById("loginNav");
    var element2 = document.getElementById("logoutNav");
    sessionStorage.setItem('loginTemp', true);
    sessionStorage.setItem('cID', "true");
    element.classList.remove("hide");
    element2.classList.add("hide");
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
function NavBar() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
    x.className += " responsive";
    } else {
    x.className = "topnav";
    }
    }
    
   // window.onscroll = function() {scrollFunction()};
    // function scrollFunction() {
    // if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    // document.getElementById("myTopnav").style.width = "100%";
    // document.getElementById("header").style.position = "fixed";
    // document.getElementById("header").style.top = "0%";
    // //document.getElementById("roll_back").style.display = "block";
    // } else {
    // document.getElementById("myTopnav").style.width = "80%";
    // document.getElementById("header").style.position = "fixed";
    // document.getElementById("header").style.top = "2rem";
    // //document.getElementById("roll_back").style.display = "none";
    // }
    // }
    var elts = {
      text1: document.getElementById("text1"),
      text2: document.getElementById("text2")
  };
  
  



    
    
