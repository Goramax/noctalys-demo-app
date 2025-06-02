<?php
chdir(__DIR__ . '/../');

require __DIR__ . '/../vendor/autoload.php';

use Goramax\NoctalysFramework\Core\Noctalys;

$app = new Noctalys();
$app->run();