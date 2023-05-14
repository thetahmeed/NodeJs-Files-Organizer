const fs = require("fs/promises");
const path = require("path");

const sourceFolder = "C:/Users/Tahmeed/Downloads";
const destinationFolder = "C:/Users/Tahmeed/Downloads";

// Read all file extensions in the source folder
fs.readdir(sourceFolder).then((files) => {
  const fileExtensions = new Set(files.map((file) => path.extname(file)));
  const fileTypes = {};

  // Define file types and their corresponding folders based on file extensions
  fileExtensions.forEach((ext) => {
    const fileType = ext.slice(1);
    fileTypes[ext] = fileType;
  });

  // Create destination folders if they don't exist
  const createFolders = Object.values(fileTypes).map((folder) => {
    const folderPath = path.join(destinationFolder, folder);
    return fs.mkdir(folderPath, { recursive: true });
  });

  Promise.all(createFolders).then(() => {
    // Move files to their corresponding folders based on file types
    files.forEach((file) => {
      const ext = path.extname(file);
      const fileType = fileTypes[ext];
      if (fileType) {
        const sourcePath = path.join(sourceFolder, file);
        const destinationPath = path.join(destinationFolder, fileType, file);
        fs.rename(sourcePath, destinationPath)
          .then(() => console.log(`Moved ${file} to ${destinationPath}`))
          .catch((err) => console.error(`Failed to move ${file}: ${err}`));
      }
    });
  }).catch((err) => console.error(`Failed to create destination folders: ${err}`));
}).catch((err) => console.error(`Failed to read source folder: ${err}`));