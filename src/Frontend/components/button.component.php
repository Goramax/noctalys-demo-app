<?php
$type = $type ?? 'primary';
$href = $href ?? null;
$text = $text ?? 'Button';
$classes = "btn btn-{$type}";

if (isset($class)) {
    $classes .= " {$class}";
}
?>

<?php if ($href): ?>
    <a href="<?= $href ?>" class="<?= $classes ?>"><?= $text ?></a>
<?php else: ?>
    <button type="<?= $buttonType ?? 'button' ?>" class="<?= $classes ?>"><?= $text ?></button>
<?php endif; ?>
