<?php
chdir(__DIR__ . '/../');

require __DIR__ . '/../vendor/autoload.php';

use Goramax\NoctalysFramework\Noctalys;
use Goramax\NoctalysFramework\Router;

$app = new Noctalys();
$app->run();