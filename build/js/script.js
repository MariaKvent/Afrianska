'use strict';

// полифилл для include (IE)

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';
    if (typeof start !== 'number') {
        start = 0;
    }

    if (start + search.length > this.length) {
        return false;
    } else {
        return this.indexOf(search, start) !== -1;
    }
  };
}

var modalMessage = document.querySelector('.message');
var modalWindow = modalMessage.querySelector('.message__wrapper');
var modalToggle = document.querySelector('.work__toggle');
var modalClosed = document.querySelector('.modal__closed');
var pageBody = document.querySelector('.page-body');
var modalSuccessClose = document.querySelector('.message__success--close');
var emailStick = modalWindow.querySelector('.form__stick');
var modalSuccess = document.querySelector('.message__success');
var inputs = modalWindow.querySelectorAll('.form__field');

var showModal = function showModal() {
  var inputName = document.getElementById('name');

  if (modalMessage) {
    modalMessage.classList.add('message--show');
  }

  if (pageBody) {
    pageBody.classList.add('scroll-hidden');
  }

  if (inputName) {
    inputName.focus();
  }
};

var closeModal = function closeModal() {
  if (modalMessage) {
    modalMessage.classList.remove('message--show');
  }

  if (pageBody) {
    pageBody.classList.remove('scroll-hidden');
  }
};

if (modalToggle) {
  modalToggle.addEventListener('click', function () {
    showModal();
  });
}

if (modalClosed) {
  modalClosed.addEventListener('click', function () {
    closeModal();
  });
}

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    closeModal();
  }
});
document.addEventListener('mouseup', function (e) {
  if (e.target === modalMessage) {
    closeModal();
  }
});

var showSuccess = function showSuccess() {
  if (modalSuccess) {
    modalSuccess.classList.add('message__success--show');
    modalWindow.classList.add('message__wrapper--fade');
  }
};

var closeSuccess = function closeSuccess() {
  if (modalSuccess) {
    modalSuccess.classList.remove('message__success--show');
    modalWindow.classList.remove('message__wrapper--fade');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('text').value = '';
    emailStick.style.display = 'none';

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].classList.contains('form__field--invalid')) {
        inputs[i].classList.remove('form__field--invalid');
      }
    }
    closeModal();
  }
};

if (modalSuccess) {
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      closeSuccess();
    }
  });
  document.addEventListener('mouseup', function (e) {
    if (e.target === modalMessage) {
      closeSuccess();
    }
  });
  modalSuccessClose.addEventListener('click', function () {
    closeSuccess();
  });
}


function sendAjaxForm(messageForm) {
  $.ajax({
    type: 'POST',
    url: 'js/actionForm.php',
    dataType: 'html',
    data: $('#' + messageForm).serialize(),
    success: function (response) {
      var result = $.parseJSON(response);
      var inputEmail = document.getElementById('email');

      function emailValid () {
        inputEmail.classList.remove('form__field--invalid');
        emailStick.style.display = 'none';
      }

      function emailNonvalid () {
        inputEmail.classList.add('form__field--invalid');
        emailStick.style.display = 'block';
      }

      if (result.res === 'success') {
        if (inputEmail.value.includes('@') && inputEmail.value.includes('.')) {
          emailValid();
        } else {
          emailNonvalid();
        }
        var inputsInvalid = modalWindow.querySelectorAll('.form__field--invalid');

        if (inputsInvalid.length === 0) {
          console.log(result);
          showSuccess();
        }
      } else {
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].value === '') {
            inputs[i].classList.add('form__field--invalid');
          }

          if (inputs[i].value !== '') {
            inputs[i].classList.remove('form__field--invalid');
          }
        }

        if (!(inputEmail.value.includes('@') && inputEmail.value.includes('.'))) {
          emailNonvalid();
        } else {
          emailValid();
        }
      }
    }
  });
}

$(document).ready(function () {
  $('#formButton').click(function () {
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].classList.contains('form__field--invalid')) {
        inputs[i].classList.remove('form__field--invalid');
      }
    }
    sendAjaxForm('messageForm', 'actionForm.php');
    return false;
  });
});
