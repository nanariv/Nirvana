var path="";
        if (document.currentScript) {
          path= document.currentScript.src;
        } else {
          var scripts = document.getElementsByTagName('script');
          path= scripts[scripts.length - 1].src;
        }
  
    var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
    var urlPathname = "http://127.0.0.1:5000";
function submitLogin() {  
    var name = document.getElementById("name-login").value;
    var address = document.getElementById("address-login").value;
    var email = document.getElementById("email-login").value;
    var mobile = document.getElementById("mobile-login").value;
    var password = document.getElementById("password-login").value;
    var region = document.getElementById("region-login").value;
    var entry = {
      "Name": name,
      "Address": address,
      "Email": email,
      "Mobile": mobile,
      "Password": password,
      "Region": region
    };
  
    fetch(urlPathname + "/signup", {
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
          
          var element = document.getElementById("feedback");
          element.classList.add("show");
          // var element2 = document.getElementById("loginNav");
          // element2.classList.add("hide");
          setTimeout(redirectLogin, 9000);
        });
      })
      .catch(function (error) {
        console.log("Fetch error: " + error);
      });
  
  }
  function redirectLogin() {
    window.location.href = pathname+"/login.html"
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