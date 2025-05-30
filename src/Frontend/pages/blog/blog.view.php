<?php if (!empty($posts)): ?>
    <div class="blog-cards">
        <?php foreach ($posts as $post): ?>
            <?= render_component('blog-card', [
                'title' => $post['title'],
                'excerpt' => $post['excerpt'],
                'date' => $post['date'],
                'link' => '/blog/' . $post['id']
            ]) ?>
        <?php endforeach; ?>
    </div>
<?php else: ?>
    <p>No post found</p>
<?php endif; ?>
