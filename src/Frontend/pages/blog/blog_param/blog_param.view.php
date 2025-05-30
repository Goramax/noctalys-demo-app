<!-- Simple blog post page -->
<article class="blog-post">
    <header class="blog-header">
        <h1 class="blog-title"><?= $postTitle ?></h1>
        <div class="blog-meta">
            <span class="blog-author">By <?= $author ?? 'Unknown Author' ?></span>
            <span class="blog-date"><?= $date ?? '' ?></span>
        </div>
    </header>
    
    <div class="blog-content">
        <?= $content ?? '' ?>
    </div>
    
    <footer class="blog-footer">
        <?= render_component('button', [
            'text' => '← Back to blog',
            'href' => '/blog',
            'type' => 'primary'
        ]) ?>
    </footer>
</article>
