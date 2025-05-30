<?php

namespace DemoApp\Backend\Services;

use DemoApp\Backend\Models\ToDoModel;

class ToDoService
{
    private ToDoModel $model;

    public function __construct(ToDoModel $model)
    {
        $this->model = $model;
    }

    public function getAllPosts(): array
    {
        return $this->model->getAll();
    }

    public function getPostById(int $id): ?ToDoModel
    {
        return $this->model->getById($id);
    }
}
