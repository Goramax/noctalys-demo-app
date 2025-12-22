<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Noctalys Demo App - A demonstration application built with the Noctalys Framework.">
    <link rel="icon" href="<?= img('favicon.ico') ?>" type="image/x-icon">
    <title><?= $title ?? 'Noctalys Demo App' ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= css_path('main') ?>">
    <?= page_css() ?>
    <script src="<?= js_path('main') ?>" defer></script>
    <?= page_js() ?>
</head>

<body>
    <header>
        <h1><?= $title ?? 'Noctalys Demo App' ?></h1>
        <?= render_component('nav') ?>
    </header>

    <main>
        <!-- Use $_view to include the main content of the page -->
        <?= $_view ?>
    </main>

    <footer>
        <?= date('Y') ?> Noctalys
    </footer>

</body>