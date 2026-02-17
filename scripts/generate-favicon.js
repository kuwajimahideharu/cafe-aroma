const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'images', 'favicon.jpg');
const outputDir = path.join(__dirname, '..', 'images');

async function generateFavicons() {
    const sizes = [
        { name: 'favicon-16.png', size: 16 },
        { name: 'favicon-32.png', size: 32 },
        { name: 'apple-touch-icon.png', size: 180 },
    ];

    for (const { name, size } of sizes) {
        const outputPath = path.join(outputDir, name);
        await sharp(inputPath)
            .resize(size, size, { fit: 'cover' })
            .png()
            .toFile(outputPath);
        console.log(`Generated: ${name} (${size}x${size})`);
    }

    console.log('All favicons generated successfully.');
}

generateFavicons().catch(err => {
    console.error('Error generating favicons:', err);
    process.exit(1);
});
