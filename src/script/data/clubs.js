import { saveClub } from './db.js';

const apiKey = '64ae66148e9648d586da26303d9109ea';
const base_url = 'https://api.football-data.org/v2/competitions/CL/teams';
const base_url_team = 'https://api.football-data.org/v2/teams';

const laodClubs = () => {
  if ('caches' in window) {
    caches.match(base_url)
      .then(response => {
        if (response) {
          response.json().then(resJson => {
            clubData(resJson);
            tooltip();
            loadDetailPage();
          });
        }
      });
  }

  fetch(base_url, 
  {
    method: 'GET',
    headers: {
    'X-Auth-Token': apiKey
  }
  })
  .then(res => res.json())
  .then(resJson => {
    clubData(resJson);
    tooltip();
    loadDetailPage();
  })
  .catch(err => console.log(err));
};

const loadClubsPage = () => {
  const btnBack = document.querySelector('#back');
  btnBack.addEventListener('click', () => {
    fetch('src/pages/clubs.html')
      .then(res => res.text())
      .then(resJson => {
        document.querySelector('#body-content').innerHTML = resJson;
        laodClubs();
      })
      .catch(e => console.log(e));
  });
};

const loadDetailPage = () => {
  const btn = document.querySelectorAll('.team');
  btn.forEach(ev => {
    ev.addEventListener('click', () => {
      fetch('src/pages/detail.html')
        .then(res => res.text())
        .then(resJson => {   
          document.querySelector('#body-content').innerHTML = resJson;
          const data = getDataTeam(ev.value);
          document.getElementById('save').onclick = () => {
            data.then(e => saveClub(e));
          };
        })
        .catch(e => console.log(e));
    });
  });
};

const getDataTeam = res => {
  const idTeam = res;
  return new Promise (resolve => {
    if ('caches' in window) {
      caches.match(`${base_url_team}/${idTeam}`)
        .then(response => {
          if (response) {
            response.json().then(resJson => {
              detailData(resJson);
              loadClubsPage();
              resolve(resJson);
            });
          }
        });
      }
      
    fetch(`${base_url_team}/${idTeam}`,
    {
      method: 'GET',
      headers: {
      'X-Auth-Token': apiKey
    }
    })
      .then(res => res.json())
      .then(resJson => {
        detailData(resJson);
        loadClubsPage();
        resolve(resJson);
      })
      .catch(e => console.log(e));
  });
};

const clubData = resJson => {
  const dataClubs = resJson.teams;
  let output = '';
  dataClubs.forEach(team => {      
    output += `
      <div class="col s12 m6">
      <div class="card hoverable tooltipped" data-position="bottom" data-tooltip="${team.name}">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="responsive-img activator" alt="logo ${team.name}" src="${team.crestUrl}">
        </div>
        <div class="card-content">
        </div>
          <div class="card-reveal">
          <div class="card-title grey-text text-darken-4 row s12">
            <div class="col s2"><img src="${team.crestUrl}" alt="logo ${team.name}" class="responsive-img left" width="300px"></div>
            <div class="col s10">
              <p class="btn light-blue darken-3 white-text flow-text center">${team.name}</p>
              <i class="material-icons right">close</i>
            </div>
          </div>
          <div>
            <ul class="collection">
              <li class="collection-item">Short Name <span class="right">${team.shortName}</span></li>
              <li class="collection-item">Club area <span class="right">${team.area.name}</span></li>
              <li class="collection-item">venue <span class="right">${team.venue}</span></li>
            </ul>
            <button class="btn waves-effect waves-light grey darken-4 right team" value="${team.id}">MORE INFO<i class="material-icons left">more</i></button>
          </div>
        </div>    
      </div>
      </div>
    `;
  });
  
  document.getElementById('team-list').innerHTML = output;
};

const detailData = resJson => {

  const list = document.querySelector('#detail');
  let output = '';
  
  output = `
    <div class="card-panel row">
      <div class="col s12">
       
      <div>
      <div class="col s12 center">
        <img src="${resJson.crestUrl}" class="responsive-img center-align">
        <h5>${resJson.name}</h5>
      </div>
      <div class="col s12">
        <ul class="collection">
          <li class="collection-item">Short Name <span class="right">${resJson.shortName}</span></li>
          <li class="collection-item">Club area <span class="right">${resJson.area.name}</span></li>
          <li class="collection-item">Founded <span class="right">${resJson.founded}</span></li>
          <li class="collection-item">venue <span class="right">${resJson.venue}</span></li>
          <li class="collection-item">Address <span class="right">${resJson.address}</span></li>
          <li class="collection-item">Email <span class="right">${resJson.email}</span></li>
          <li class="collection-item">Phone <span class="right">${resJson.phone}</span></li>
          <li class="collection-item">Website <span class="right">${resJson.website}</span></li>
        </ul>
      </div>
    </div>
    <button class="btn grey darken-4 left" id="back">BACK</button> 
  `;
  
  list.innerHTML = output;
};
const tooltip = () => {
  const elems = document.querySelectorAll('.tooltipped');
    // eslint-disable-next-line no-undef
    M.Tooltip.init(elems);
};
export default laodClubs;