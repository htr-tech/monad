const fs = require('fs');
const { isAddress } = require('ethers');

function processFiles() {
    try {
        const addressData = fs.readFileSync('address.txt', 'utf8');
        const sortedData = fs.existsSync('sorted.txt') ? fs.readFileSync('sorted.txt', 'utf8') : '';

        // remove duplicates and invalid addresses
        const addressLines = new Set(
            addressData.split('\n')
                .map(line => line.trim().toLowerCase())
                .filter(line => line && isAddress(line))
        );

        const sortedLines = new Set(
            sortedData.split('\n')
                .map(line => line.trim().toLowerCase())
                .filter(line => line && isAddress(line))
        );

        // Remove addresses that exist in sorted.txt
        const uniqueAddresses = [...addressLines].filter(
            address => !sortedLines.has(address)
        );

        fs.writeFileSync('address.txt', uniqueAddresses.join('\n'));
        
        console.log(`Processed addresses:
- Original: ${addressLines.size} (after dedupe)
- Removed: ${addressLines.size - uniqueAddresses.length} (found in sorted.txt)
- Final: ${uniqueAddresses.length} addresses remaining`);

    } catch (error) {
        console.error('Error processing files:', error.message);
        process.exit(1);
    }
}

processFiles();
