<?php

if (
        !empty(trim($_POST['name']))
        && !empty(trim($_POST['email']))
        && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)
        && !empty(trim($_POST['message']))
    )
{

    $mail_to = "info@rightblog.ru"; // Email куда будет отправлено письмо
    $email_from = "info@webcademy.ru"; // Указываем от кого будет отправлено письмо, email, reply to
    $name_from = "Личный сайт портфолио"; // Указываем от кого будет отправлено письмо, имя
    $subject = "Сообщение с сайта!"; // Тема письма

    // Формируем текст письма
    $message =  "Вам пришло новое сообщение с сайта: <br><br>\n" .
        "<strong>Имя отправителя:</strong>" . strip_tags(trim($_POST['name'])) . "<br>\n" .
        "<strong>Email отправителя: </strong>" . strip_tags(trim($_POST['email'])) . "<br>\n" .
        "<strong>Сообщение: </strong>" . strip_tags(trim($_POST['message']));

    // Формируем тему письма, специально обрабатывая её
    $subject = "=?utf-8?B?" . base64_encode($subject) . "?=";

    // Формируем заголовки письма
    $headers = "MIME-Version: 1.0" . PHP_EOL .
        "Content-Type: text/html; charset=utf-8" . PHP_EOL .
        "From: " . "=?utf-8?B?" . base64_encode($name_from) . "?=" . "<" . $email_from . ">" .  PHP_EOL .
        "Reply-To: " . $email_from . PHP_EOL;

    // Отправляем письмо
    $mailResult = mail($mail_to, $subject, $message, $headers);

    if ($mailResult) {
        $response = [
            'status' => true,
            'message' => 'Сообщение успешно отправлено'
        ];
    } else {
        $response = [
            'status' => false,
            'message' => 'Произошла ошибка при отправке письма'
        ];
    }

    echo json_encode($response);

} else {
    $response = [
        'status' => false,
        'message' => []
    ];

    if (empty(trim($_POST['name']))) {
        $response['message'][] = "Поле 'Имя' не может быть пустым.";
    }

    if (empty(trim($_POST['email']))) {
        $response['message'][] = "Поле 'Email' не может быть пустым.";
    }

    if ( !filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) ) {
        $response['message'][] = "Введите верный формат 'Email'.";
    }

    if (empty(trim($_POST['message']))) {
        $response['message'][] = "Поле 'Сообщение' не может быть пустым.";
    }

    echo json_encode($response);
}
