/* eslint-disable no-undef */
import idb from 'idb';

let dbPromised = idb.open('Champions-info', 1, upgradeDb => {
  let clubsObjectStore = upgradeDb.createObjectStore('clubs', { keyPath: 'id' });
  clubsObjectStore.createIndex('tla', 'tla', { unique: false });
});

export const saveClub = e => {
  dbPromised
    .then(db => {
      const tx = db.transaction('clubs', 'readwrite');
      const store = tx.objectStore('clubs');
      store.add(e);
      return tx.complete;
    })
    .then(() => {
      console.log('berhasil di simpan');
      const toastHTML = `
        <i class="material-icons left">info</i> <span> save success!</span>
      `;
      M.toast({html: toastHTML, classes: 'rounded green'});
    })
    .catch(() => {
      const toastHTML = `
        <i class="material-icons left">info</i> <span> this club was added!</span>
      `;
      M.toast({html: toastHTML, classes: 'rounded red'});
    });
};

export const getAll = () => {
  return new Promise((resolve, reject) => {
    dbPromised
      .then(db => {
        const tx = db.transaction('clubs', 'readonly');
        const store = tx.objectStore('clubs');
        return store.getAll();
      })
      .then(clubs => resolve(clubs))
      .catch(e => reject(e));
  });
};

export const deleteClub = e => {
  const key = parseInt(e);
  dbPromised
    .then(db => {
      const tx = db.transaction('clubs', 'readwrite');
      const store = tx.objectStore('clubs');
      store.delete(key);
      return tx.complete;
    })
    .then(() => {
      console.log('deleted!');
      const toastHTML = `
        <i class="material-icons left">info</i> <span> delete success!</span>
      `;
      M.toast({html: toastHTML, classes: 'rounded blue'});
    })
    .catch(e => {
      console.log(e);
      const toastHTML = `
        <i class="material-icons left">info</i> <span> delete failed!</span>
      `;
      M.toast({html: toastHTML, classes: 'rounded red'});
    });
};