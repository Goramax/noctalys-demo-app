<?php

namespace DemoApp\Backend\Models;
use Goramax\NoctalysFramework\Services\File;
use Goramax\NoctalysFramework\Abstract\Model;

class ToDoModel extends Model
{
    public int $id;
    public string $title;
    public string $content;
    public string $excerpt;
    public string $date;
    public string $author;

    public function getAll(): array
    {
        $data = json_decode(File::read('public/blog-data.json'), true) ?: [];
        return array_map(fn($post) => ToDoModel::fromArray($post), $data);
    }

    public function getById(int $id): ?ToDoModel
    {
        $data = json_decode(File::read('public/blog-data.json'), true) ?: [];
        foreach ($data as $post) {
            if ($post['id'] === $id) {
                return ToDoModel::fromArray($post);
            }
        }
        return null;
    }
}