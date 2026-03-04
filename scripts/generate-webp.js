/**
 * generate-webp.js
 * Converts all gallery/content JPGs to WebP format for performance optimization.
 * Does NOT convert favicon images.
 */

const sharp = require('sharp');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

// Images to convert (excluding favicon source)
const targets = [
    'hero.jpg',
    'concept.jpg',
    'gallery-cappuccino.jpg',
    'gallery-interior.jpg',
    'gallery-beans.jpg',
    'gallery-latte-art.jpg',
    'gallery-sweets.jpg',
    'gallery-counter.jpg',
];

async function convertToWebP() {
    console.log('WebP変換を開始します...\n');

    for (const filename of targets) {
        const inputPath = path.join(IMAGES_DIR, filename);
        const outputPath = path.join(IMAGES_DIR, filename.replace(/\.jpg$/i, '.webp'));

        try {
            const info = await sharp(inputPath)
                .webp({ quality: 82 })
                .toFile(outputPath);

            const inputSize = require('fs').statSync(inputPath).size;
            const savings = (((inputSize - info.size) / inputSize) * 100).toFixed(1);
            console.log(`✓ ${filename} → ${path.basename(outputPath)}  (${(info.size / 1024).toFixed(0)}KB, -${savings}%)`);
        } catch (err) {
            console.error(`✗ ${filename}: ${err.message}`);
        }
    }

    console.log('\n完了しました。');
}

convertToWebP();
