// Material Design color palette array
const materialColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B'
];

// Function to select a random color from the Material Design color palette
const getRandomMaterialColor = () => {
    const randomIndex = Math.floor(Math.random() * materialColors.length);
    return materialColors[randomIndex];
}

// Read the card packs from a JSON file
function readDecksFromFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const result = [];
    jsonFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const fileName = path.parse(file).name;
        const isVIP = fileName.endsWith('-vip');
        result.push({ fileName,isVIP, data });
    });

    return result;
}

module.exports = {
    getRandomMaterialColor,
    readDecksFromFolder
}