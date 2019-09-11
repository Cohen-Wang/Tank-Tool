<?php

//download();
function download () {
    $filename = '../../test/errorLog/20181120/1.txt';

    $file = fopen($filename, "r");

    Header("Content-type: application/octet-stream");
    Header("Accept-Ranges: bytes");
    Header("Accept-Length: " . filesize($filename));
    Header("Content-Disposition: attachment; filename=php123.txt");
}





$filepath = '../../test/1.2.3.zip';
download2($filepath);
function download2 ($filepath) {
    header("Cache-Control: public");
    header("Content-Description: File Transfer");
    header("Content-Type: application/octet-stream"); // zip格式的
    header("Content-disposition: attachment; filename=" . basename($filepath)); // 文件名
    header("Content-Transfer-Encoding: binary"); // 告诉浏览器，这是二进制文件
    header("Content-Length:" . filesize($filepath)); // 告诉浏览器，文件大小
    readfile($filepath);
};