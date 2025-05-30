<div class="error-container">
    <div class="error-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-message">
            Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div class="error-actions">
            <?= render_component('button', [
                'text' => 'Go Home',
                'href' => '/',
                'type' => 'primary'
            ]) ?>
            <?= render_component('button', [
                'text' => 'Browse Blog',
                'href' => '/blog',
                'type' => 'secondary'
            ]) ?>
        </div>
    </div>
    <div class="error-illustration">
        <div class="floating-elements">
            <div class="element element-1"></div>
            <div class="element element-2"></div>
            <div class="element element-3"></div>
        </div>
    </div>
</div>