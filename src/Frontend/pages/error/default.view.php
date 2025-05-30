<div class="error-container">
    <div class="error-content">
        <div class="error-code neon-text"><?= $code ?? 'Error' ?></div>
        <h1 class="error-title">Something went wrong</h1>
        <p class="error-message">
            <?= $message ?? 'An unexpected error occurred. Please try again later.' ?>
        </p>
        <div class="error-actions">
            <?= render_component('button', [
                'text' => 'Go Home',
                'href' => '/',
                'type' => 'primary'
            ]) ?>
            <?= render_component('button', [
                'text' => 'Try Again',
                'href' => 'javascript:history.back()',
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
