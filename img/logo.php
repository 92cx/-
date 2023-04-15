<?php

// 获取本地图片文件夹目录
$dir = 'logo/';

// 获取图片文件夹中所有的图片文件
$files = glob($dir . "*.{jpg,jpeg,png,gif}", GLOB_BRACE);

// 生成随机数，用于选择一个随机的图片文件
$rand_index = rand(0, count($files) - 1);

// 选择随机的图片文件
$rand_file = $files[$rand_index];

// 设置返回的Content-Type为image/jpeg
header('Content-Type: image/jpeg');

// 输出选定的图片文件
readfile($rand_file);

?>