<?php

namespace DemoApp\Backend\Controllers;

use DemoApp\Backend\Services\ToDoService;
use DemoApp\Backend\Models\ToDoModel;
use Goramax\NoctalysFramework\Api\Response;
use Goramax\NoctalysFramework\Attributes\Route;
use Goramax\NoctalysFramework\Validator;

class ToDoController
{
    private ToDoService $service;

    public function __construct()
    {
        $this->service = new ToDoService(new ToDoModel());
    }

    #[Route(method: 'GET', path: '/api/posts')]
    public function get()
    {
        $todos = $this->service->getAllPosts();
        return Response::success(
            array_map(fn($todo) => $todo->toArray(), $todos),
            '200 OK'
        );
    }

    #[Route(method: 'GET', path: '/api/post/{id}')]
    public function getById($params)
    {
        $id = $params['id'] ?? null;

        $idValidation = Validator::validate($id)
            ->number()
            ->not()->empty()
            ->isValid();

        if (!$idValidation) {
            return Response::error('Invalid ID format', 400);
        }

        $todo = $this->service->getPostById((int) $id);

        if (!$todo) {
            return Response::error('Post not found', 404);
        }

        return Response::success($todo->toArray(), '200 OK');
    }
}
