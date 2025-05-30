<form method="post" action="">
<h2><?= $title ?></h2>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" value="<?= value('name') ?>">
    <?= csrf_input() ?>

    <button type="submit">Send</button>
</form>
