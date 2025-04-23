import fs from "fs";
import FormData from "form-data";
import rfs from "recursive-fs";
import basePathConverter from "base-path-converter";
import got from "got";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = (question) => new Promise((resolve) => rl.question(question, resolve));

const pinDir = async () => {
    try {
        const folderName = await prompt("Folder to pin: ");
        const jwtToken = await prompt("JWT token: ");

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const src = folderName.trim();
        if (!fs.existsSync(src)) {
            throw new Error(`${src} not found`);
        }

        const { dirs, files } = await rfs.read(src);

        if (files.length === 0) {
            throw new Error(`No files found in folder "${src}"`);
        }

        let data = new FormData();

        for (const file of files) {
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(src, file),
            });
        }

        console.log(`Uploading ${files.length} files from "${src}"...`);

        const response = await got(url, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwtToken.trim()}`
            },
            body: data
        })
            .on('uploadProgress', progress => {
                console.log(`Upload progress: ${Math.round(progress.percent * 100)}%`);
            });

        const result = JSON.parse(response.body);
        console.log("\nUpload successful!");
        console.log(`IPFS Hash: ${result.IpfsHash}`);
        console.log(`Pin Size: ${result.PinSize}`);
        console.log(`Timestamp: ${result.Timestamp}`);
    } catch (error) {
        console.error("\nError:", error.message);
    } finally {
        rl.close();
    }
};

pinDir();
