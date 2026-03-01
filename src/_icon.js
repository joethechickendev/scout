import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pngToIco from 'png-to-ico';
const { gen, AssetSize, GenErrorCode } = await import('icns-gen');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  path.join(__dirname, '../images/icon-16x16.png'),
  path.join(__dirname, '../images/icon-32x32.png'),
  path.join(__dirname, '../images/icon-48x48.png'),
  path.join(__dirname, '../images/icon-256x256.png'),
];

images.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
  } else {
    console.log(`File found: ${file}`);
  }
});

// Create ICO file
pngToIco(images)
  .then((buf) => {
    fs.writeFileSync(path.join(__dirname, '../images/icon.ico'), buf);
    console.log('icon.ico created successfully!');
  })
  .catch((err) => {
    console.error('Error creating .ico file:', err);
  });

// Create ICNS file
(async () => {
  try {
    await gen(
      [
        { size: AssetSize.S16, path: path.join(__dirname, '../images/icon-16x16.png') },
        { size: AssetSize.S32, path: path.join(__dirname, '../images/icon-32x32.png') },
        { size: AssetSize.S64, path: path.join(__dirname, '../images/icon-48x48.png') },
        { size: AssetSize.S256, path: path.join(__dirname, '../images/icon-256x256.png') },
      ],
      path.join(__dirname, '../images/icon.icns')
    );

    console.log('ICNS file generated successfully!');
  } catch (error) {
    if (error.code === GenErrorCode.ASSET_PATH_OR_BUFFER_MUST_BE_SET) {
      console.error('Please provide either a path or buffer for each asset');
    } else if (error.code === GenErrorCode.ASSET_SIZE_NOT_SUPPORTED) {
      console.error('One of the provided sizes is not supported');
    } else {
      console.error('An unexpected error occurred:', error.message || error);
    }
  }
})();