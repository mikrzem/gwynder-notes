const fs = require('fs');
const path = require('path');

console.log('Extracting version from package.json');

const packageJson = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, 'package.json'),
        'utf8'
    ).toString()
);

const version = packageJson.version;

console.log('Found application version: ' + version);

fs.writeFileSync(
    path.join(__dirname, 'dist', 'version.txt'),
    version,
    'utf8'
);

console.log('Created file ./dist/version.txt containing version');

