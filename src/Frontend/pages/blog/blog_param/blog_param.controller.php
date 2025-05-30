<?php

use Goramax\NoctalysFramework\View;
use Goramax\NoctalysFramework\Router;
use Goramax\NoctalysFramework\Validator;
use Goramax\NoctalysFramework\File;

/**
 * About page controller
 */
class ExampleController
{
    public function main()
    {
        $posts = json_decode(File::read('public/blog-data.json'), true);

        // Get the post ID from the URL parameters
        $postId = Router::getParams()['blog'] ?? null;
        if (
            !Validator::validate($postId)->number()->not()->empty()->isValid()
            || !isset($posts[$postId - 1]) // Check if post ID exists in the array
        ) {
            Router::error('404'); // Redirect to 404 if post ID is invalid
        } else {
            $postId = (int)$postId - 1; // Adjust for zero-based index
        }

        $data = [
            'title' => 'Blog',
            'postTitle' => $posts[$postId]['title'] ?? '',
            'content' => $posts[$postId]['content'] ?? '',
            'date' => $posts[$postId]['date'] ?? '',
            'author' => $posts[$postId]['author'] ?? '',

        ];

        View::render('blog_param', $data);
    }
}
