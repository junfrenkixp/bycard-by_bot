$(document).ready(function(){
  try {
    value=JSON.parse((document.cookie.match(/^(?:.*;)?\s*telegramUser\s*=\s*([^;]+)(?:.*)?$/)||[,undefined])[1]);
  } catch (err) {
    $(".telegramAuth").collapse('show');
    $('.progress').removeClass('show');
    $(".progress").collapse('hide');
    return;
  }
  var str = JSON.stringify(value);
  var progress = $(".loading");
  $.ajax({
    type: 'POST',
    url: '/auth/check',
    data: str,
    contentType: 'application/json',
    dataType: 'json',
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          var percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);
          progress.css('width', percentComplete + '%');
        }
      }, false);
      return xhr;
    },
    success: function(response) {
      $('.progress').removeClass('show');
      $(".progress").collapse('hide');
      if (response["error"]) {
        $('.telegramAuth').collapse('show');
        $('.alert').text(response["error"]);
        $(".alert").slideDown(250);
        setTimeout(function() { 
          $('.alert').slideUp(250); 
        }, 5000);
        return;
      }
      if (response["response"]=="getConfirm") {
        $('.confirm').collapse('show');
        $('#account').text(response["account"]);
        return;
      }
      $('.bycardAuth').collapse('show');
    }
  });
});
function onTelegramAuth(user) {
  var str = JSON.stringify(user);
  $.ajax({
    type: 'POST',
    url: '/auth/check',
    data: str,
    contentType: 'application/json',
    dataType: 'json',
    success: function(response) {
      if (response["error"]) {
        $('.alert').text(response["error"]);
        $(".alert").slideDown(250);
        setTimeout(function() { 
          $('.alert').slideUp(250); 
        }, 5000);
        return;
      }
      var str = JSON.stringify(user);
      var date = new Date(new Date().getTime() + 86400 * 1000);
      document.cookie = "telegramUser="+str+"; path=/; expires="+date.toUTCString();
      $('.telegramAuth').collapse('hide');
      if (response["response"]=="getConfirm") {
        $('.confirm').collapse('show');
        $('#account').text(response["account"]);
        return
      }
      $('.bycardAuth').collapse('show');
    }
  });
}
$("#loginform").submit(function(eventObj) {
  eventObj.preventDefault()
  try {
    value=JSON.parse((document.cookie.match(/^(?:.*;)?\s*telegramUser\s*=\s*([^;]+)(?:.*)?$/)||[,undefined])[1]);
  } catch (err) {
    $('.bycardAuth').collapse('hide');
    $('.telegramAuth').collapse('show');
    $('.alert').text("Нешта перашкодзіла атрымаць дадзеныя з Вашага Telegram-акаўнта. Паспрабуйце яшчэ раз");
    $(".alert").slideDown(250);
    setTimeout(function() { 
      $('.alert').slideUp(250); 
    }, 5000);
    return;
  }
  value.login=$("#login").val();
  value.password=$("#password").val();
  var str = JSON.stringify(value);
  $.ajax({
    type: 'POST',
    url: '/auth',
    async: false,
    data: str,
    dataType: 'json',
    contentType: 'application/json',
    success: function(response) {
      if (response["response"]) {
        $('#account2').text(response["account"]);
        $('.bycardAuth').collapse('hide');
        $('.successAuth').collapse('show');
      } else if (response["error"]) {
        if (response["code"]==1) {
          $('.bycardAuth').collapse('hide');
          $('.telegramAuth').collapse('show');
          $('.alert').text(response["error"]);
          $(".alert").slideDown(250);
          setTimeout(function() { 
            $('.alert').slideUp(250); 
          }, 5000);
        } else {
          $('.alert').text(response["error"]);
          $(".alert").slideDown(250);
          setTimeout(function() { 
            $('.alert').slideUp(250); 
          }, 5000);
        }
      }
    }
  });
});
$("#registerform").submit(function(eventObj) {
  eventObj.preventDefault()
  try {
    value=JSON.parse((document.cookie.match(/^(?:.*;)?\s*telegramUser\s*=\s*([^;]+)(?:.*)?$/)||[,undefined])[1]);
  } catch (err) {
    $('.registerAuth').collapse('hide');
    $('.telegramAuth').collapse('show');
    $('.alert').text("Нешта перашкодзіла атрымаць дадзеныя з Вашага Telegram-акаўнта. Паспрабуйце яшчэ раз");
    $(".alert").slideDown(250);
    setTimeout(function() { 
      $('.alert').slideUp(250); 
    }, 5000);
    return;
  }
  value.login=$("#rlogin").val();
  value.password=$("#rpassword").val();
  value.email=$("#remail").val()
  var str = JSON.stringify(value);
  $.ajax({
    type: 'POST',
    url: '/auth/register',
    async: false,
    data: str,
    dataType: 'json',
    contentType: 'application/json',
    success: function(response) {
      if (response["response"]) {
        $('#account2').text(response["account"]);
        $('.registerAuth').collapse('hide');
        $('.successAuth').collapse('show');
      } else if (response["error"]) {
        if (response["code"]==1) {
          $('.registerAuth').collapse('hide');
          $('.telegramAuth').collapse('show');
          $('.alert').text(response["error"]);
          $(".alert").slideDown(250);
          setTimeout(function() { 
            $('.alert').slideUp(250); 
          }, 5000);
        } else {
          $('.alert').text(response["error"]);
          $(".alert").slideDown(250);
          setTimeout(function() { 
            $('.alert').slideUp(250); 
          }, 5000);
        }
      }
    }
  });
});
