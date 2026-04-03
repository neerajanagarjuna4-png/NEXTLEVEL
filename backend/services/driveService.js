import { google } from 'googleapis';
import { Readable } from 'stream';

const getAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  return new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
};

const driveClient = async () => {
  const auth = getAuth();
  return google.drive({ version: 'v3', auth });
};

export const uploadFile = async (fileName, mimeType, buffer) => {
  const drive = await driveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const res = await drive.files.create({
    requestBody: { name: fileName, mimeType, parents: folderId ? [folderId] : [] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: 'id, webViewLink, webContentLink'
  });
  // Make public (optional)
  try {
    await drive.permissions.create({ fileId: res.data.id, requestBody: { role: 'reader', type: 'anyone' } });
  } catch (e) {}
  return { fileId: res.data.id, viewLink: res.data.webViewLink, downloadLink: `https://drive.google.com/uc?id=${res.data.id}&export=download` };
};

export const listFiles = async () => {
  const drive = await driveClient();
  const res = await drive.files.list({ q: process.env.GOOGLE_DRIVE_FOLDER_ID ? `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents` : undefined, fields: 'files(id, name, webViewLink, createdTime)' });
  return res.data.files || [];
};

export const deleteFile = async (fileId) => {
  const drive = await driveClient();
  await drive.files.delete({ fileId });
};

export default { uploadFile, listFiles, deleteFile };
