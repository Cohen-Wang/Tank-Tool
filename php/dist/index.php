<?php

header('Content-Type:text/html; charset=UTF-8');

if (date_default_timezone_get() !== 'Asia/Shanghai')
{
    date_default_timezone_set('Asia/Shanghai');
}

$action = isset($_POST['action']) ? $_POST['action'] : "";

switch ($action)
{

    case "index_acquireIP" :
        echo $_SERVER['SERVER_ADDR'];
        break;

    case "index_getFileMD5" :
        $fileContent = $_POST['content'];
        echo md5($fileContent);
        break;

    default :
        echo "failed to receive action";
        break;
}