/* eslint-disable no-undef */
import laodClubs from './data/clubs.js';
import loadStandings from './data/standings.js';
import loadHome from './data/home.js';
import getSavedClub from './data/saved.js';
import {loadTop} from './data/home.js';

const main = () => {

    const navAll = document.querySelectorAll('.topnav, .sidenav');
    const content = document.querySelector('#body-content');
    // navigation onclick location
    let page = window.location.hash.substr(1);
    if (page === '') page = 'home';

    // register service worker
    if (!('serviceWorker' in navigator)) {
        console.log('browser is not support service worker');
    } else {
        navigator.serviceWorker.register('/sw.js')
            .then(() => {
                console.log('service worker registered');
                navigator.serviceWorker.ready.then(() => {
                    if (('PushManager' in window)) {
                        navigator.serviceWorker.getRegistration().then((registration) => {
                            registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array('BMRJy9tZCYNQjK3srrWx3bteZUikrLQpW2hlcQV0mB09mBeI80s7uNAt2ZrXf-Dm_bqfHnIdIxsVzXqVwg8C-1o')
                            })
                            .then(subscribe => {
                                console.log('subscribe success with endpoint: ', subscribe.endpoint);
                                console.log('subscribe success with p256dh key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('p256dh')))));
                                console.log('subscribe success with auth key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth')))));
                            })
                            .catch(e => console.error(`Error : ${e.message}`));
                        });
                    }
                });
            })
            .catch(err => console.log('failed register service worker', err));
    }
    // base 64 string
    const urlBase64ToUint8Array = base64String => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };
    // materialize element init
    const materialInit = () => {
        const floatBtn = document.querySelectorAll('.fixed-action-btn');
        const elems = document.querySelectorAll('.slider');
        const select = document.querySelectorAll('select');
        M.Slider.init(elems);
        M.FormSelect.init(select);
        M.FloatingActionButton.init(floatBtn);
    };
    // fetch navigation
    const loadNav = () => {
        fetch('./src/pages/nav.html')
            .then(res => res.text())
            .then(resText => {
                navAll.forEach(e => {
                    e.innerHTML = resText;
                    onClickNav();
                });
            })
            .catch(e => console.log(e));
    };
    // load each page
    const loadPage = page => {
        fetch(`./src/pages/${page}.html`)
            .then(res => res.text())
            .then(resText => {
                content.innerHTML = resText;
                materialInit();
                if (page === 'clubs') {
                    laodClubs();
                } else if (page === 'standings') {
                    loadStandings();
                } else if (page === 'saved') {
                    getSavedClub();
                } else {
                    loadHome();
                    loadTop();
                }
            })
            .catch(() => content.innerHTML = `<p>halaman ${page} tidak bisa diakses!<p>`);
    };
    // on navigation click
    const onClickNav = () => {
        navAll.forEach(e => {
            e.addEventListener('click', event => {
                const sidenav = document.querySelector('.sidenav');
                M.Sidenav.getInstance(sidenav).close();
                page = event.target.getAttribute('href').substr(1);
                loadPage(page);
            });
        });
    };
    // auto init navbar
    M.AutoInit();
    loadNav();
    loadPage(page);
};

export default main;