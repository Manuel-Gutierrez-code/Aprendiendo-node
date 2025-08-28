const fs = require('node:fs/promises')
const path = require('node:path')
const pc = require('picocolors')

const folder = process.argv[2] ?? '.'

async function ls (folder) {
  let files

  try {
    files = await fs.readdir(folder)
  } catch {
    console.error(pc.red(`Error en el directorio ${folder}`))
    process.exit(1)
  }

  const filesPromises = files.map(async file => {
    const filesPath = path.join(folder, file)
    let stats

    try {
      stats = await fs.stat(filesPath)
    } catch {
      console.error(`Error en el archivo ${filesPath}`)
      process.exit(1)
    }

    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'd' : '-'
    const fileSize = stats.size
    const fileModified = stats.mtime.toLocaleString()

    return `${pc.bgMagentaBright(fileType)} ${pc.blue(file.padEnd(20))} ${pc.green(fileSize.toString().padStart(10))} ${pc.yellow(fileModified)}`
  })

  const filesInfo = await Promise.all(filesPromises)

  filesInfo.forEach(file => console.log(file))
}

ls(folder)
