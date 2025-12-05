<?php

use Noctalys\Framework\View\View;
use Noctalys\Framework\Security\Validator;

/**
 * About page controller
 */
class ExampleController
{
    public function main()
    {
        $data = [
            'title' => 'Example Page',
            'message' => 'This is an example page of the Noctalys Demo App. Here you can find an example form with basic CSRF',
        ];

        if (isset($_POST) && !empty($_POST)) {

            if (!csrf_check()) {
                $data['form_error'] = 'Invalid CSRF token. Please try again.';
            }

            if (!Validator::validate($_POST['name'])->not()->empty()->isValid()) {
                $data['form_error'] = 'Name cannot be empty.';
            } else if (!Validator::validate($_POST['name'])->minLength(3)->maxLength(50)->isValid()) {
                $data['form_error'] = 'Name must be between 3 and 50 characters.';
            }

            if (empty($data['form_error'])) {
                $data['form_message'] = 'Your name is: ' . $_POST['name'];
                $_POST = [];
            }
        }

        View::render('example', $data);
    }
}
