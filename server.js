// const fs = require('fs');
// const archiver = require('archiver');
// const path = require('path');

// // Define the directory to be zipped
// const projectDir = path.join(__dirname, 'https://lovable.dev/projects/9ccdf892-1b07-47b2-a0e3-8d88c1057b5f'); // Replace with your project folder
// // Define the output zip file path
// const outputPath = path.join(__dirname, 'lovable-ai-project.zip');

// // Create a file to stream archive data to.
// const output = fs.createWriteStream(outputPath);
// const archive = archiver('zip', {
//   zlib: { level: 9 } // Maximum compression
// });

// // Listen for all archive data to be written
// output.on('close', function() {
//   console.log(`${archive.pointer()} total bytes`);
//   console.log('Archiver has finalized and the zip file has been created.');
// });

// // Catch warnings (e.g., stat failures) and errors
// archive.on('warning', function(err) {
//   if (err.code === 'ENOENT') {
//     console.warn(err);
//   } else {
//     throw err;
//   }
// });
// archive.on('error', function(err) {
//   throw err;
// });

// // Pipe archive data to the file
// archive.pipe(output);

// // Append files from the project directory, putting its contents at the root of the archive
// archive.directory(projectDir, false);

// // Finalize the archive (i.e., finish the file stream)
// archive.finalize();



const axios = require('axios');
const cheerio = require('cheerio');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Get URL from command line arguments; if not provided, use a default URL.
const url = process.argv[2] || 'https://example.com';

// Create a temporary directory for storing code files
const tempDir = path.join(__dirname, 'tempCode');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function fetchAndZipCode() {
  try {
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Assuming code blocks are inside <pre><code> tags
    const codeBlocks = $('pre code');

    if (codeBlocks.length === 0) {
      console.log('No code blocks found on the page.');
      return;
    }

    console.log(`Found ${codeBlocks.length} code block(s).`);

    // Save each code block into a separate file
    codeBlocks.each((index, element) => {
      const codeContent = $(element).text();
      const fileName = `code_${index + 1}.txt`;
      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, codeContent);
      console.log(`Saved ${fileName}`);
    });

    // Create a zip archive from the temporary directory
    const zipFilePath = path.join(__dirname, 'codeArchive.zip');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Archive created successfully: ${zipFilePath}`);
      console.log(`Total bytes: ${archive.pointer()}`);
      // Optionally, remove the temporary directory after archiving
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(tempDir, false);
    await archive.finalize();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchAndZipCode();
