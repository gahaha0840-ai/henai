import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const files = fs.readdirSync(imagesDir);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg') continue;

  const inputPath = path.join(imagesDir, file);
  const tempPath = path.join(imagesDir, `${path.basename(file, ext)}.tmp${ext}`);

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(file, 'orientation=', metadata.orientation);
    await sharp(inputPath)
      .rotate()
      .withMetadata({ orientation: 1 })
      .toFile(tempPath);
    fs.renameSync(tempPath, inputPath);
    console.log('fixed', file);
  } catch (err) {
    console.error('error', file, err);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}
