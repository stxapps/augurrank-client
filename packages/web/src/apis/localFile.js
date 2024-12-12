import * as idb from 'idb-keyval';

const getFile = async (fpath) => {
  let content; // If no key, val will be undefined.
  try {
    content = await idb.get(fpath);
  } catch (error) {
    console.log('In localFile.getFile, IndexedDB error:', error);
  }
  return content;
};

const putFile = async (fpath, content) => {
  try {
    await idb.set(fpath, content);
  } catch (error) {
    console.log('In localFile.putFile, IndexedDB error:', error);
  }
};

const deleteFile = async (fpath) => {
  try {
    await idb.del(fpath);
  } catch (error) {
    console.log('In localFile.deleteFile, IndexedDB error:', error);
  }
};

const deleteAllFiles = async () => {
  try {
    await idb.clear();
  } catch (error) {
    console.log('In localFile.deleteAllFiles, IndexedDB error:', error);
  }
};

const listFiles = async () => {
  /** @type any[] */
  let keys;
  try {
    keys = await idb.keys();
  } catch (error) {
    console.log('In localFile.getStaticFPaths, IndexedDB error:', error);
    keys = [];
  }
  return keys;
};

const localFile = {
  getFile, putFile, deleteFile, deleteAllFiles, listFiles,
};

export default localFile;
