function saveID() {
  if (window.localStorage == null) {
    alert("local storage fail");
    return;
  } else {
    if(document.getElementById('account').value){
        var email = document.getElementById('account').value;
        var passwd = document.getElementById('password').value;
        window.localStorage.account = email;
        window.localStorage.password = passwd;
    }else{
        window.localStorage.account = "";
        window.localStorage.password = "";
    }

    var socket = io.connect('http://localhost:8080')
    socket.emit('login', { email: email, password: passwd })
    get_user_list()
    chrome.storage.sync.set({
      'account': window.localStorage.account,
      'password': window.localStorage.password,
    }, function () {});
  }
}

function main() {
  if (window.localStorage == null) {
    alert("local storage fail");
    return;
  }

  document.getElementById('account').value = window.localStorage.account || "";
  document.getElementById('password').value = window.localStorage.password || "";

  chrome.storage.sync.set({
    'account': window.localStorage.account,
    'password': window.localStorage.password
  }, function () {});
}

function get_user_list(){
  var try_login = false
  var socket = io.connect('http://localhost:8080')
  // initialisation user list
  socket.on('user_list', function(threads) {
  		threads.forEach(
        function (val, i) {
          var option = document.createElement('option')
          option.value = val.id
          option.innerHTML = val.name
          if(window.localStorage.getItem("sendToId") === null && i == 0){
            option.setAttribute('selected', true)
            window.localStorage.sendToId = document.getElementById('user_list').value;
            chrome.storage.sync.set({
              'sendToId': window.localStorage.sendToId
            }, function () {});
          }
          if(val.id == window.localStorage.sendToId)
            option.setAttribute('selected', true);
          // get img
          //<img src="" alt="Contact Person">
          //((val.image)?val.image:'https://graph.facebook.com/'+val.id+'/picture?width=50')
          document.getElementById("user_list").appendChild(option);
        })
  })
  socket.on('erreur', function(err) {
      switch (err) {
          case 'Wrong username/password.':
              alert('no user login')
              if(!try_login && window.localStorage.account){
                alert('auto login')
                try_login = true
              }
              break
          default:
  				    console.log(err)
      }
  })
  socket.emit('ready')
}

function setMsgTo(){
  window.localStorage.sendToId = document.getElementById('user_list').value;
  chrome.storage.sync.set({
    'sendToId': window.localStorage.sendToId
  }, function () {});
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  get_user_list();
  document.getElementById('save').addEventListener('click', saveID);
  document.getElementById('user_list').addEventListener('change', setMsgTo);
});
