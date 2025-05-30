<p><?= $message ?></p>

<?= render_component('form', [
    'title' => 'Example Form',
]); ?>

<?php if (isset($form_message)) : ?>
    <p class="form-message"><?= $form_message ?></p>
<?php endif; ?>

<?php if (isset($form_error)) : ?>
    <p class="form-error"><?= $form_error ?></p>
<?php endif; ?>