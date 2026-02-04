const path = require("path");
const getAllFiles = require("../utils/getFiles");
const buttonCache = {
  default: null,
  otherdir: null
};

module.exports = (dir, exceptions = [], otherdir = false) => {
  const cacheKey = otherdir ? 'otherdir' : 'default';
  if (buttonCache[cacheKey]) return buttonCache[cacheKey];

  let buttons = [];
  // Escanea todos los subdirectorios de Buttons/
  const baseDir = otherdir
    ? path.join(dir, '..', 'Buttons')
    : path.join(dir, '..', '..', 'Buttons');

  // Recursivo: busca todos los archivos .js en todos los subdirectorios
  const allButtonFiles = [];
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (path.extname(fullPath) === '.js') {
        allButtonFiles.push(fullPath);
      }
    }
  }
  scanDir(baseDir);

  for (const buttonFile of allButtonFiles) {
    try {
      delete require.cache[require.resolve(buttonFile)];
      const button = require(buttonFile);
      if (!exceptions.includes(button.name)) {
        buttons.push(button);
      }
    } catch (e) {
      console.error(`Error loading button ${buttonFile}:`, e);
    }
  }

  buttonCache[cacheKey] = buttons;
  return buttons;
};
