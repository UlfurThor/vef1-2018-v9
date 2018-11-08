/* eslint-disable no-console */

// const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let form;
  let input;
  let results;

  // DONE
  function el(type, className, clickHandler) {
    const element = document.createElement(type);
    if (className) {
      element.classList.add(className);
    }
    if (clickHandler) {
      element.addEventListener('click', clickHandler);
    }
    return element;
  }

  // DONE
  function emptyResults() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  // DONE
  function showMessage(message) {
    emptyResults();
    const mess = el('h1');
    mess.innerHTML = message;
    results.appendChild(mess);
  }

  // DONE
  function showLoading() {
    showMessage('Leita að léni...');
    const imgdiv = el('div', 'loading');
    const img = el('img');
    img.setAttribute('src', 'loading.gif');
    imgdiv.appendChild(img);

    results.appendChild(imgdiv);
  }

  // DONE
  function addResChild(dl, key, val) {
    const dt = el('dt');
    dt.innerHTML = key;
    const dd = el('dd');
    dd.innerHTML = val;
    dl.appendChild(dt);
    dl.appendChild(dd);
    return dl;
  }

  // for some stupid reason Date.Parse does not work
  function dateParser(date) {
    let m;
    const split = date.split(' ');
    const y = split[2];
    const d = split[0].slice(0, -1).padStart(2, '0');
    const mString = split[1].toLowerCase();
    switch (mString) {
      case 'january':
        m = '01';
        break;
      case 'february':
        m = '02';
        break;
      case 'march':
        m = '03';
        break;
      case 'april':
        m = '04';
        break;
      case 'may':
        m = '05';
        break;
      case 'June':
        m = '06';
        break;
      case 'july':
        m = '07';
        break;
      case 'august':
        m = '08';
        break;
      case 'september':
        m = '09';
        break;
      case 'october':
        m = '10';
        break;
      case 'november':
        m = '11';
        break;
      case 'december':
        m = '12';
        break;

      default:
        m = '00';
        break;
    }
    const s = `${y}-${m}-${d}`;
    return s;
  }

  // DONE
  function addResChildTime(dl, key, val) {
    const dt = el('dt');
    dt.innerHTML = key;
    const dd = el('dd');
    // for some reason this does not work
    // let t = Date.parse(val);
    const t = dateParser(val);
    dd.innerHTML = t;
    dl.appendChild(dt);

    dateParser(val);
    dl.appendChild(dd);
    return dl;
  }

  // Done
  function showResults(data) {
    emptyResults();
    console.log(data);
    if (data === undefined) {
      showMessage('Lén er ekki skráð');
      return;
    }
    let res = el('dl');
    console.log('data');
    res = addResChild(res, 'Lén', data.domain);
    res = addResChildTime(res, 'Skráð', data.registered);
    res = addResChildTime(res, 'Seinast breytt', data.lastChange);
    res = addResChildTime(res, 'Rennur út', data.expires);
    if (data.registrantname !== '' && typeof data.registrantname !== 'undefined') {
      res = addResChild(res, 'Skráningaraðili ', data.registrantname);
    }
    if (data.email !== '' && typeof data.email !== 'undefined') {
      res = addResChild(res, 'Netfang', data.email);
    }
    if (data.address !== '' && typeof data.address !== 'undefined') {
      res = addResChild(res, 'Heimilisfang', data.address);
    }
    if (data.country !== '' && typeof data.country !== 'undefined') {
      res = addResChild(res, 'Land', data.country);
    }


    results.appendChild(res);
  }

  // DONE
  function fetchData(webDomain) {
    fetch(`${API_URL}${webDomain}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        showMessage('Lén verður að vera strengur');
        throw new Error('Inproper URL formating');
      })
      .then((data) => {
        showResults(data.results[0]);
      })
      .catch((error) => {
        showMessage('Villa við að sækja gögn');
        console.error(error);
      });
  }

  function formHandler(e) {
    e.preventDefault();
    const txt = input.value;
    if (txt.trim().length === 0) {
      showMessage('Lén verður að vera strengur');
      return;
    }
    showLoading();
    // todo add load listener
    fetchData(txt);
    input.value = '';
  }

  function init(domains) {
    form = domains.querySelector('form');
    input = form.querySelector('input');
    form.addEventListener('submit', formHandler);

    results = domains.querySelector('.results');
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
