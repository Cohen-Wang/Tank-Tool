<?php


require '../app/ManageFile.class.php';
$manageFile = new ManageFile();





if (!true) {
    // ZipArchive()
    $zip = new ZipArchive();
    $zip_path = './test.zip';
    if (($zip->open($zip_path, ZipArchive::CREATE)) === TRUE) {
        $zip->addFile('../../views/404.html');
        $zip->addFile('./a/b1/c1/d1.txt', basename('./a/b1/c1/d1.txt'));
        $zip->addFile('./fileMd5.php', basename('./fileMd5.php'));
        $zip->addFile('D:/tank/program/Tank-Tool/php/dist/updateEditor.php');
        $zip->close();
    }
}

if (!true) {
    // 常量 define const区别
    define('DB', 'aaaaa');
    echo DB;
    echo "<pre>";
    print_r(get_defined_constants());
}

if (!true) {
    $filename = "./aaa/bbb/ccc/a.txt";

    echo pathinfo($filename, PATHINFO_DIRNAME)."<br>";
    echo pathinfo($filename)['dirname']."<br>";
    echo dirname($filename)."<br>";

    echo pathinfo($filename, PATHINFO_BASENAME)."<br>";
    echo pathinfo($filename)['basename']."<br>";
    echo basename($filename)."<br>";

    echo pathinfo($filename, PATHINFO_FILENAME)."<br>";
    echo pathinfo($filename)['filename']."<br>";
    echo basename($filename, '.txt')."<br>";

    echo pathinfo($filename, PATHINFO_EXTENSION)."<br>";
    echo pathinfo($filename)['extension']."<br>";

//echo get_extension($filename)."<br>";

//$filename2 = "./test.php";
//print_r(file($filename2))."<br>";
}




if (!true) {
    $zip = new ZipArchive();
    if ($zip->open('demo.zip', ZipArchive::CREATE) === TRUE) {
//        echo $zip->status.PHP_EOL;//Zip Archive 的状态
//        echo $zip->statusSys.PHP_EOL;//Zip Archive 的系统状态
//        echo $zip->numFiles.PHP_EOL;//压缩包里的文件数
//        echo $zip->filename.PHP_EOL;//在文件系统里的文件名，包含绝对路径
//        echo $zip->comment.PHP_EOL;//压缩包的注释

        /* ZipArchive类中的常用方法*/
        // 设置压缩包的密码
        $zip->setPassword('qqqqqqqq');
        // 在zip压缩包中建一个空文件夹，成功时返回 TRUE， 或者在失败时返回 FALSE
        $zip->addEmptyDir('css');
        // 在zip更目录添加一个文件,并且命名为in.html,第二个参数可以省略
        $zip->addFile('manageHotUpdateEditor.php');// 根目录下
        $zip->addFile('manageHotUpdateEditor.php','relativePath/manageHotUpdateEditor.php');// 相对路径
        // 往zip中一个文件中添加内容
        $zip->addFromString('test.txt', 'file content goes here');
        $zip->addFromString('index.html','hello world');
        //$zip->extractTo('/tmp/zip/');//解压文件到/tmp/zip/文件夹下面
        //$zip->renameName('in.html','index.html');//重新命名zip里面的文件
        //设置压缩包的注释
        //$zip->setArchiveComment('Do what you love,Love what you do.');
        //获取压缩包的注释
        //$zip->getArchiveComment();
        //获取压缩包文件的内容
        //$zip->getFromName('index.html');
        //删除文件
        //$zip->deleteName('index.html');
        //
        $zip->setEncryptionName('manageHotUpdateEditor.php', ZipArchive::EM_AES_256);


        $zip->close();//关闭资源句柄
    }
    else {
        echo "文件打开失败";
    }
}



if (!true) {
    $str = "D:\/tank\/program\/Tank-Tool\/test\/Tank-Update2\/src\/cyber.lua";
    $start = strrpos($str, 'src');
    $newstr = substr($str, $start);
    echo $newstr;
}

if (!true) {
    echo "<pre>";
    print_r($_SERVER);
    echo "</pre>";
}

if (!true) {
    // 有效
    ini_set("max_execution_time", 0);
    echo ini_get("max_execution_time");

    // 无效
    ini_set('upload_max_filesize', '2000M');
    ini_set("max_file_uploads", '200M');
    //echo ini_get('upload_max_filesize');

}




if (!true) {
    $manageFile = new ManageFile();
    $dirname = './test';

    //mkdir('./test', 0777);
    //chmod('./test', 0755); // 八进制数，正确的 mode 值
    echo "<pre>";
    $stat = stat('./test/a.txt');
    print_r($stat);
    //
    $ctime = $manageFile->getFileCreateTime('./test/a.txt');
    echo $ctime.PHP_EOL;
    $mtime = $manageFile->getFileModificationTime('./test/a.txt');
    echo $mtime.PHP_EOL;
    $atime = $manageFile->getFileAccessTime('./test/a.txt');
    echo $atime.PHP_EOL;
    echo date("Y-m-d H:i:s", -6060606060);
}


if (!true) {
    echo "<pre>";
    print_r(get_loaded_extensions());
}

/**
 * 测试服务器的memcache是否正确
 */
if (!true) {

    define('MEMCACHE_TIME', 24 * 60 * 60);
    // 实例化
    $mc = new Memcache();
    $mc->addServer('192.168.16.101', 11211, 33);
    $mc->delete('age');
    $mc->set('age', '这是一个变量2');// 写入缓存
    $name = $mc->get('age');
    echo $name;
}

/**
 * 查看缓存的date内容
 */
if (!true) {
    define('MEMCACHE_TIME', 24 * 60 * 60);
    // 实例化
    $mc = new Memcache();
    $mc->addServer('192.168.16.101', 99999, true, 20, 1, 15);
    // 设置值
    $date = date("Ymd");
    echo $date;
    // 查看缓存内容
    echo "<pre>";
    print_r($mc->get($date));
    echo "</pre>";
}