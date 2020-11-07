const apiKey = '64ae66148e9648d586da26303d9109ea';
const base_url = 'https://api.football-data.org/v2/competitions/CL/matches';
const base_top_url = 'https://api.football-data.org/v2/competitions/CL/scorers';

const laodHome = () => {
    if ('caches' in window) {
        caches.match(base_url)
            .then(response => {
                if (response) {
                    response.json().then(resJson => loadMatches(resJson));
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
    .then(resJson => loadMatches(resJson))
    .catch(err => console.log(err));
};

export const loadTop = () => {
    if ('caches' in window) {
        caches.match(base_top_url)
            .then(response => {
                if (response) {
                    response.json().then(resJson => loadPlayer(resJson));
                }
            });
        }
        
    fetch(base_top_url,
    {
        method: 'GET',
        headers: {
        'X-Auth-Token': apiKey
    }
    })
    .then(res => res.json())
    .then(resJson => loadPlayer(resJson))
    .catch(e => console.log(e));

};

const loadMatches = (resJson) => {
    let match = document.querySelector('#matches');
        match.addEventListener('change', () => {
            const matches1 = resJson.matches.filter( d => d.matchday == match.value);

            let load = `
                <div class="progress">
                    <div class="indeterminate"></div>
                </div>
            `;

            let hasil = matches1.map(elm => {
                const utcDate = elm.utcDate.substr(0, 10);
                const timeDate = elm.utcDate.substr(11);
                let scoreHomeTeam = elm.score.fullTime.homeTeam;
                let scoreAwayTeam = elm.score.fullTime.awayTeam;
                if (scoreHomeTeam === null) {
                    scoreHomeTeam = 0;
                    scoreAwayTeam = 0;
                }

                return `
                    <div class="col s12 l6 m12">
                        <div class="card-panel hoverable"><h5 class="center card-panel grey darken-4 white-text">${elm.group.toUpperCase()}</h5>
                            <div class="card-panel">
                            <div class="row">
                                <div class="col s4 left center">
                                    <p class="center">Home Team</p>
                                    <h4 class="center card white-text blue">${scoreHomeTeam}</h4>
                                    <p class="center">${elm.homeTeam.name}</p>
                                </div>
                                <div class="col s4 center">
                                </div>
                                <div class="col s4 right center">
                                    <p class="center">Away Team</p>
                                    <h4 class="center card white-text blue">${scoreAwayTeam}</h4>
                                    <p class="center">${elm.awayTeam.name}</p>
                                </div>
                            
                                <div class="col s12">
                                    <ul class="collection">
                                        <li class="collection-item"> 
                                        Status 
                                        <span class="new badge red right" data-badge-caption="${elm.status}"></span></li>
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
                            </div>
                        </div>
                    </div>
                `;
            }).join('<br>');

            document.querySelector('#matches1').innerHTML = load;
            setTimeout(() => {
                document.querySelector('#matches1').innerHTML = hasil;
            }, 1000);
            
        });
};

const loadPlayer = resJson => {
    let output = `
        <thead>
            <tr>
                <th>Name</th>
                <th>club</th>
                <th>Position</th>
                <th>Goal</th>
            </tr>
        </thead>
        <tbody>
    `;
    resJson.scorers.forEach(e => {
        output += `
            <tr>
                <td>${e.player.firstName}</td>
                <td>${e.team.name}</td>
                <td>${e.player.position}</td>
                <td>${e.numberOfGoals}</td>
            </tr>
        `;
    });
    document.querySelector('#score-list').innerHTML = output;
};
export default laodHome;