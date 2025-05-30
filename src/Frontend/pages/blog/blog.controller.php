<?php

use Goramax\NoctalysFramework\View;
use Goramax\NoctalysFramework\File;

/**
 * About page controller
 */
class ExampleController
{
    public function main()
    {

        $posts = json_decode(File::read('public/blog-data.json'), true);


        $data = [
            'title' => 'Blog',
            'posts' => $posts
        ];

        View::render('blog', $data);
    }
}
