// ==UserScript==
// @name         dotlive-bballoon
// @namespace    yameholo
// @author       meihei
// @version      2.0
// @description  .LIVEのキャラクターの風船が飛ぶよ
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function () {
  // 正方形
  const IMAGE_SIZE = '160px';
  // 風船を飛ばすタイミング
  const TIMEOUT = 0;

  const BALLOONS = {
    rikopin: 'https://pbs.twimg.com/media/Eg8p-hRUMAEN5Ut?format=png',
    merrysan: 'https://pbs.twimg.com/media/EhHgPEPUcAA53ve?format=png',
    sirochan: 'https://pbs.twimg.com/media/EhHf42oVgAAtnsz?format=png',
    azukichi: 'https://pbs.twimg.com/media/Eg8p_GuVgAEf334?format=png',
    uma: 'https://pbs.twimg.com/media/Eg_wPavUMAE5-sS?format=png',
    mememe: 'https://pbs.twimg.com/media/Eg_vKdhUwAA8EwY?format=png',
    fuchan: 'https://pbs.twimg.com/media/Eg_vNfPWoAAPT7w?format=png',
    iorin: 'https://pbs.twimg.com/media/Eg_vOaKVoAAsqMn?format=png',
    boss: 'https://pbs.twimg.com/media/Eg_vPZ6VgAEr4md?format=png',
    chierichan: 'https://pbs.twimg.com/media/Eg3gCQMXgAgRt6i?format=png',
    natonato: 'https://pbs.twimg.com/media/EgEAa9yU4AIm53T?format=png',
    pinosama: 'https://pbs.twimg.com/media/EgEAbjcVoAEjY0Q?format=png',
    gongon: 'https://pbs.twimg.com/media/EgEAcZsUMAA4S60?format=png',
  };

  const setBalloonBaseStyle = (el) => {
    el.style.width = IMAGE_SIZE;
    el.style.height = IMAGE_SIZE;
    el.style.position = 'fixed';
    el.style.top = '100vh';
    el.style.display = 'none';
  };

  const setBalloonBackground = (el, src) => {
    el.style.backgroundImage = `url(${src})`;
    el.style.backgroundSize = 'cover';
  };

  const createBolloon = (img) => {
    const el = document.createElement('div');
    setBalloonBaseStyle(el);
    setBalloonBackground(el, img);
    return el;
  };

  const randint = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  const releaseBalloon = (balloon) => {
    const x = randint(0, 90);
    const sign = Math.random() > 0.5 ? 1 : -1;

    balloon.style.left = `${x}vw`;
    balloon.style.display = 'block';

    const sequence = [
      {
        offset: 0,
        transform: `rotateZ(${sign * 0.1}deg) translate(0, 0)`,
      },
      {
        offset: 0.1,
        transform: `rotateZ(${-1 * sign * 0.2}deg) translate(0, -1vh)`,
      },
      {
        offset: 0.2,
        transform: `rotateZ(${sign * 0.2}deg) translate(0, -4vh)`,
      },
      {
        offset: 0.3,
        transform: `rotateZ(${-1 * sign * 0.2}deg) translate(0, -9vh)`,
      },
      {
        offset: 0.4,
        transform: `rotateZ(${sign * 0.2}deg) translate(0, -16vh)`,
      },
      {
        offset: 0.5,
        transform: `rotateZ(${-1 * sign * 0.2}deg) translate(0, -25vh)`,
      },
      {
        offset: 0.6,
        transform: `rotateZ(${sign * 0.2}deg) translate(0, -36vh)`,
      },
      {
        offset: 0.7,
        transform: `rotateZ(${-1 * sign * 0.2}deg) translate(0, -49vh)`,
      },
      {
        offset: 0.8,
        transform: `rotateZ(${sign * 0.2}deg) translate(0, -64vh)`,
      },
      {
        offset: 0.9,
        transform: `rotateZ(${-1 * sign * 0.2}deg) translate(0, -81vh)`,
      },
      {
        offset: 1,
        transform: `rotateZ(${sign * 0.2}deg) translate(0, -100vh)`,
      },
    ];

    const animation = balloon.animate(sequence, {
      duration: 3000,
      delay: 100,
    });

    animation.onfinish = () => {
      balloon.style.display = 'none';
    };
  };

  const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  };

  const main = () => {
    const db = document.createElement('div');
    document.body.append(db);

    const keys = shuffle(Object.keys(BALLOONS));
    keys.forEach((key) => {
      const balloon = createBolloon(BALLOONS[key]);
      document.body.append(balloon);
      setTimeout(() => {
        db.append(balloon);
        releaseBalloon(balloon);
      }, TIMEOUT + randint(0, 1500));
    });
  };

  const isBirthday = () => document.querySelector('span[data-focusable=true]') !== null;

  const URL_REGEX = /^https:\/\/twitter.com\/(?<name>\w+)$/g;

  const isURI = (param) => {
    return param === 'home'
            || param === 'explore'
            || param === 'notifications'
            || param === 'messages'
            || param === 'settings';
  };

  const isProfile = () => {
    const match = URL_REGEX.exec(location.href);
    if (match) {
      return !isURI(match.groups.name);
    }
    return false;
  };

  let prev = null;

  const isChangedUrl = () => prev !== location.href;

  const firer = () => {
    // URLの変更を感知
    if (isChangedUrl()){
      // プロフィール画面かつ誕生日であるか
      if (isProfile() && isBirthday()) {
        setTimeout(main, 0);
        document.querySelector('span[data-focusable=true]').addEventListener('click', main);
      }
    }
    prev = location.href
  };

  setInterval(firer, 1000);
})();
