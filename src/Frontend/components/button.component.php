<?php if ($href ?? null): ?>
    <a href="<?= $href ?>"
        class="btn btn-<?= $type ?? 'primary' ?><?= isset($class) ? ' ' . $class : '' ?>"
        <?= ($blank ?? false) ? ' target="_blank" rel="noopener noreferrer"' : '' ?>>
        <?= $text ?? 'Button' ?>
    </a>
<?php else: ?>
    <button type="<?= $buttonType ?? 'button' ?>"
        class="btn btn-<?= $type ?? 'primary' ?><?= isset($class) ? ' ' . $class : '' ?>">
        <?= $text ?? 'Button' ?>
    </button>
<?php endif; ?>