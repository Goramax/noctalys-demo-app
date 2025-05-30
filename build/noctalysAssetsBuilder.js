import { exec } from 'child_process'

export default function NoctalysAssetsBuilder() {
  return {
    name: 'noctalys-assets-builder',
    configureServer(server) {
      server.config.logger.info(
        `\n 🔨 Noctalys is now in dev mode 🔨\n    Changes will be watched 👀 \n`
      )
    },
    handleHotUpdate({ file, server }) {
      if (/\.(scss|css|sass)$/i.test(file)) {
        console.log(`[rebuild] Style modified: ${file}`)
        exec('yarn build:css', (err, stdout, stderr) => {
          if (err) console.error(stderr)
          else console.log(stdout)
          server.ws.send({ type: 'full-reload' })
        })

      } else if (/\.js$/i.test(file)) {
        console.log(`[rebuild] Script modified: ${file}`)
        exec('yarn build:js', (err, stdout, stderr) => {
          if (err) console.error(stderr)
          else console.log(stdout)
          server.ws.send({ type: 'full-reload' })
        })

        if (/\.php$/i.test(file)) {
          console.log(`[reload] PHP file modified: ${file}`)
          // no build, just trigger reload
          server.ws.send({ type: 'full-reload' })
        } else if (/\.(tpl|twig|latte|blade|mustache|hbs|xhtml|html)$/i.test(file)) {
          console.log(`[reload] Template file modified: ${file}`)
          // no build, just trigger reload for template files
          server.ws.send({ type: 'full-reload' })
        }
      }
    }
  }
}
