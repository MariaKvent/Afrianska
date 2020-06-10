<?php

  if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['text']) ) {
    if (($_POST['name'] !== '') && ($_POST['email'] !== '') && ($_POST['text'] !== '')) {
      $result = array(
        'res' => 'success',
        'name' => $_POST['name'],
        'email' => $_POST['email'],
        'text' => $_POST['text']
      );

      echo json_encode($result);

    } else {
      $result = array(
        'res' => 'error'
      );
      echo json_encode($result);
    }
  }
?>
