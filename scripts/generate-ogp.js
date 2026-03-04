/**
 * generate-ogp.js
 * Generates a 1200×630 OGP image from hero.jpg for social sharing meta tags.
 */

const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'images', 'hero.jpg');
const outputPath = path.join(__dirname, '..', 'images', 'ogp.jpg');

async function generateOGP() {
    console.log('OGP画像を生成中...');

    const info = await sharp(inputPath)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outputPath);

    console.log(`✓ ogp.jpg 生成完了 (${(info.size / 1024).toFixed(0)}KB, ${info.width}×${info.height})`);
}

generateOGP().catch(err => {
    console.error('エラー:', err.message);
    process.exit(1);
});
