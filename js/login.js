var path="";
      if (document.currentScript) {
        path= document.currentScript.src;
      } else {
        var scripts = document.getElementsByTagName('script');
        path= scripts[scripts.length - 1].src;
      }

  var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
  var urlPathname = "http://127.0.0.1:5000";
  var loginTemp = false; 

function signUp() {
  window.location.href = pathname+"/signup.html";
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
function submitLogin() {
  
  var path="";
      if (document.currentScript) {
        path= document.currentScript.src;
      } else {
        var scripts = document.getElementsByTagName('script');
        path= scripts[scripts.length - 1].src;
      }

  var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
  var urlPathname = "http://127.0.0.1:5000";
  var name = document.getElementById("email-login").value;
  var message = document.getElementById("password-login").value;
  var entry = {
    username: name,
    password: message
  };

  fetch(urlPathname + "/login", {
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
        loginTemp = false; 
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.json().then(function (data) {
        console.log(data);
        if(entry.username === "administrator@gmail.com")
        {
          sessionStorage.setItem('admin', true);
          sessionStorage.setItem('loginTemp', true);
          window.location.href = pathname+"/admin.html";
        }
        else {
          sessionStorage.setItem('loginTemp', true);
          sessionStorage.setItem('cID', data[0].CustomerID);
          sessionStorage.setItem('Name', data[0].Name);
          sessionStorage.setItem('Email', data[0].Email);
          sessionStorage.setItem('Address', data[0].Address);
          sessionStorage.setItem('Mobile', data[0].Mobile);
          sessionStorage.setItem('Region', data[0].Region);
          window.location.href = pathname+"/catalog.html";
        }
        var element = document.getElementById("feedback");
        element.classList.add("show");
        
        
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });

}

function signUp() {
  var path="";
        if (document.currentScript) {
          path= document.currentScript.src;
        } else {
          var scripts = document.getElementsByTagName('script');
          path= scripts[scripts.length - 1].src;
        }

    var pathname = path.substr(0,path.lastIndexOf('/', path.lastIndexOf('/')-1));
  window.location.replace(pathname+'/signup.html');
}
  