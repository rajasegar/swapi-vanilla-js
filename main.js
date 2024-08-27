import './style.css'

let resource = "people"
let prevPageUrl = null;
let nextPageUrl = `https://swapi.dev/api/${resource}/?page=2`
let records = []

// TODO: Add store implementation

const App = {
  $: {
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    app: document.querySelector('main'),
    left: document.querySelector('#left-section'),
    right: document.querySelector('#right-section'),
    search: document.getElementById('input-search'),
    resource: document.getElementById('lst-resource'),
    records: document.getElementsByName('records'),
    
    showLoader(show) {
      if(show) {
      App.$.left.innerHTML = `<p>Loading...</p>`        
      } else {
        App.$.left.innerHTML = '';
      }
    },

    resetRight(){
      App.$.right.innerHTML = '';
    }
  },
  init() {
    App.fetchData('https://swapi.dev/api/people');

    App.$.btnPrev.addEventListener('click', () => App.fetchData(prevPageUrl))
    App.$.btnNext.addEventListener('click', () => App.fetchData(nextPageUrl))

    App.$.search.addEventListener('input', (ev) => {
      const query = ev.target.value;
      console.log(query)
      const search = `https://swapi.dev/api/${resource}/?search=${query}`
      if(query.length > 2) {
        App.fetchData(search)
                
      } else {
        records = [];
        App.render();
      }

    })

    App.$.resource.addEventListener('change', (ev) => {
      resource = ev.target.value;
      const _url = `https://swapi.dev/api/${resource}/`
      App.fetchData(_url)
    })

    App.$.app.addEventListener('click', (ev) => {

      if(ev.target.name?.match(/records/)) {
        const id = ev.target.value;
        
        // console.log(ev.target.value)
        fetch(`https://swapi.dev/api/${resource}/${id}/`)
          .then(res => res.json())
          .then(data => {
            // console.log(data)
            switch(resource) {
            case "people":
              App.renderPeople(data);
              break;

            case "planets":
              App.renderPlanet(data);
              break;

              
            }

 
          })
      }

    })
  },
  fetchData(url){
    App.$.showLoader(true);
        App.$.resetRight();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        App.$.showLoader(false);
        prevPageUrl = data.previous;
        nextPageUrl = data.next;
        records = data.results;
        App.render();
      })
  },
  render() {
    App.$.right.innerHTML = '';
    if(!prevPageUrl) {
      App.$.btnPrev.setAttribute('disabled', true);
    } else {
      App.$.btnPrev.removeAttribute('disabled')
    }

    if(!nextPageUrl) {
      App.$.btnNext.setAttribute('disabled', true);
    } else {
      App.$.btnNext.removeAttribute('disabled')
    }



    const list = records.map((r,idx) => {
          const name = resource == "films" ? r.title : r.name;
      return `<p><label><input type="radio" value="${idx+1}" name="records"/> ${name}</label></p>`
    }).join('')
    App.$.left.innerHTML = list;

  },
  renderPeople(data) {
            App.$.right.innerHTML = `<h2>${data.name}</h2>
<p>Height: ${data.height}</p>
<p>Mass: ${data.mass}</p>
<p>Hair color: ${data.hair_color}</p>
<p>Skin color: ${data.skin_color}</p>
<p>Eye color: ${data.eye_color}</p>
<p>Birth Year: ${data.birth_year}</p>
<p>Gender: ${data.gender}</p>

`    
  },

  renderPlanet(data) {
    const population = new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(data.population)
    const markup = `<h2>${data.name}</h2>
<p>Climate: ${data.climate}</p>
<p>Diameter: ${data.diameter}</p>
<p>Gravity: ${data.gravity}</p>
<p>Orbital Period: ${data.orbital_period}</p>
<p>Population: ${population}</p>
<p>Rotation period: ${data.rotation_period}</p>
<p>Surface water: ${data.surface_water}</p>
<p>Terrain: ${data.terrain}</p>

`
    App.$.right.innerHTML = markup;
  }

  
}

App.init();
