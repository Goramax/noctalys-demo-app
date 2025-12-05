<?php
chdir(__DIR__ . '/../');

require __DIR__ . '/../vendor/autoload.php';

use Noctalys\Framework\Core\Noctalys;

$app = new Noctalys();
$app->run();