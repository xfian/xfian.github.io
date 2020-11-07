/* eslint-disable no-undef */
import { getAll, deleteClub } from './db.js';
const apiKey = '64ae66148e9648d586da26303d9109ea';

const getSavedClub = () => {
    getAll().then(clubs => {
        const content = document.querySelector('#content-list');
        let output = '<ul class="collapsible popout">';
        clubs.forEach(data => {
            output += `
                <li>
                    <div class="collapsible-header">
                    <i class="material-icons">offline_pin</i>${data.name}
                    </div>
                    <div class="collapsible-body">
                        <div class="m6 s12">
                            <div class="container center">
                                <img class="responsive-img center" src="${data.crestUrl}">
                            </div>
                            <div class="card-panel">
                                <ul class="collection">
                                <li class="collection-item active blue darken-4"><h4 class="center">${data.shortName}</h4></li>
                                <li class="collection-item">Club area <span class="right">${data.area.name}</span></li>
                                <li class="collection-item">Founded <span class="right">${data.founded}</span></li>
                                <li class="collection-item">Venue <span class="right">${data.venue}</span></li>
                                <li class="collection-item">Address <span class="right">${data.address}</span></li>
                                <li class="collection-item">Email <span class="right">${data.email}</span></li>
                                <li class="collection-item">Phone <span class="right">${data.phone}</span></li>
                                <li class="collection-item">Website <span class="right">${data.website}</span></li>
                                </ul>
                            </div>
                            <button class="btn waves-effect waves-light grey darken-4 all-btn" value="${data.id}">Matches Scheduled
                                <i class="material-icons right">watch_later</i>
                            </button>
                            <button class="btn waves-effect waves-light red darken-4 delete" value="${data.id}">Delete
                                <i class="material-icons right">delete</i>
                            </button>
                        </div>
                    </div>
                </li>
            `;
            content.innerHTML = output;
            const allBtn = document.querySelectorAll('.all-btn');
            const deleteBtn = document.querySelectorAll('.delete');
            const collaps = document.querySelectorAll('.collapsible');
            M.Collapsible.init(collaps);

            deleteBtn.forEach(e => {
                e.addEventListener('click', () => {
                    deleteClub(e.value);
                });
            });

            allBtn.forEach(e => {
                e.addEventListener('click', () => {
                    const coll = document.querySelector('.collapsible');
                    M.Collapsible.getInstance(coll).close();
                    matchesSch(e.value);
                });
            });
        });
    });
};

const matchesSch = e => {
    let match_url = `https://api.football-data.org/v2/teams/${e}/matches?status=SCHEDULED`;

    if ('caches' in window) {
        caches.match(match_url)
            .then(response => {
                if (response) {
                    response.json().then(resJson => {
                        loadData(resJson);
                    });
                }
            });
    }
    
    fetch(match_url,
    {
        method: 'GET',
        headers: {
        'X-Auth-Token': apiKey
    }
    })
    .then(res => res.json())
    .then(resJson => loadData(resJson))
    .catch(err => console.log(err));
};

const loadData = resJson => {
    const matches = document.querySelector('#macth-list');
    let clMatches = resJson.matches.filter(e => e.competition.id == '2001');
    let load = `
        <div class="progress">
        <div class="indeterminate"></div>
        </div>
    `;
    let output = `
        <div class="card-panel grey darken-4 white-text">
            <h5>Matches Schedule <i class="material-icons right">access_time</i></h5>
        </div>
    `;
    clMatches.forEach(e => {
        const utcDate = e.utcDate.substr(0, 10);
        const timeDate = e.utcDate.substr(11);

        output += `
            <div class="card-panel hoverable">
                <h6 class="center card-panel grey darken-4 white-text">${e.competition.name}</h6>
                <div class="card-panel">
                <div class="row">
                    <div class="col s4 left center">
                        <p class="card blue darken-4 white-text">${e.homeTeam.name}</p>
                    </div>
                    <div class="col s4 center">
                        <h4 class=""> VS </h4>
                    </div>
                    <div class="col s4 right center">
                        <p class="card blue darken-4 white-text">${e.awayTeam.name}</p>
                    </div>
                </div>
                    <div class="col s12">
                        <ul class="collection">
                            <li class="collection-item"> 
                            Status 
                            <span class="new badge red right" data-badge-caption="${e.status}"></span></li>
                            <li class="collection-item">
                            Start Date
                            <span class="right">${utcDate}</span>
                            </li>
                            <li class="collection-item">
                            At
                            <span class="right">${timeDate}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        matches.innerHTML = load;
        setTimeout(() => {
            matches.innerHTML = output;
        }, 1000);
    });
};

export default getSavedClub;