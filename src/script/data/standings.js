const apiKey = '64ae66148e9648d586da26303d9109ea';
const base_url = 'https://api.football-data.org/v2/competitions/2001/standings';

const laodStandings = () => {

    if ('caches' in window) {
        caches.match(base_url)
            .then(response => {
                if (response) {
                    response.json().then(resJson => {
                        loadIndicator();
                        loadGroups(resJson);
                    });
                }
            });
    }
    loadNet();
};

const loadNet = () => {
    fetch(base_url, 
        {
            method: 'GET',
            headers: {
            'X-Auth-Token': apiKey
        }
        })
        .then((res) => res.json())
        .then((resJson) => {
            loadIndicator();
            loadGroups(resJson);
        })
        .catch(err => console.log(err));
};

const loadIndicator = () => {
    let load = `
        <div class="progress">
            <div class="indeterminate"></div>
        </div>
    `;
    document.querySelector('#list').innerHTML = load;
};

const loadGroups = resJson => {
    const startDate = resJson.season.startDate.substr(0, 4);
    const endDate = resJson.season.endDate.substr(0, 4);
    const group = resJson.standings.filter(e => e.type === 'TOTAL');
    let output = `
        <div class="card-panel grey darken-4 white-text">
            <h5>${resJson.competition.name}<h5>
            <h5>Season ${startDate} / ${endDate}</h5>
        </div>
    `;
    
        
    group.forEach(e => {
        output += `  
            <table class="striped centered z-depth-3">
            <div class="card-panel z-depth-2">
                <h5>GROUP ${e.group.substr(6)} <i class="material-icons right">arrow_drop_down_circle</i></h5>
            
            <thead>
            <tr>
                <th>Pos</th>
                <th></th>
                <th>Name</th>
                <th>Game</th>
                
                <th class="hide-on-med-and-down">Win</th>
                <th class="hide-on-med-and-down">Draw</th>
                <th class="hide-on-med-and-down">Lost</th>
                <th>Points</th>
            </tr>
            </thead>
            <tbody>
            <tr>
        `;        
        e.table.forEach(tab => {
            output += `
                <td>${tab.position}
                <td>
                <img src="${tab.team.crestUrl}" width="35px"></td>
                <td>${tab.team.name}</td>
                <td>${tab.playedGames}</td>
                
                <td class="hide-on-med-and-down">${tab.won}</td>
                <td class="hide-on-med-and-down">${tab.draw}</td>
                <td class="hide-on-med-and-down">${tab.lost}</td>
                <td>${tab.points}</td>
                </tr>
            `;
        });        
    });
    
    setTimeout(() => {
        document.querySelector('#list').innerHTML = output;
    }, 1000);
};

export default laodStandings;