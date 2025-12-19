/************ CONFIG ************/
const ROOT_FOLDER_ID = "https://drive.google.com/drive/folders/1JujpQ0BNPHJhQdbNBF4LIFqsZTT2-tDz";

/************ UPLOAD DOCUMENT ************/
function uploadDocument(e) {
  const empId = e.parameter.empId;
  const fileName = e.parameter.fileName;
  const base64Data = e.parameter.fileData;

  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);

  // Create employee folder if not exists
  let empFolder;
  const folders = root.getFoldersByName(empId);
  empFolder = folders.hasNext() ? folders.next() : root.createFolder(empId);

  // Decode and save file
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    e.parameter.mimeType,
    fileName
  );

  const file = empFolder.createFile(blob);

  // Save link in Sheets
  SpreadsheetApp.getActive()
    .getSheetByName("Documents")
    .appendRow([
      empId,
      fileName,
      file.getUrl(),
      new Date()
    ]);

  return json({
    status: "uploaded",
    url: file.getUrl()
  });
}
