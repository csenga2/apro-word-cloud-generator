const log = require('loglevel');
const request = require('request');
const cheerio = require('cheerio');

const maxKezdo = 600;
const countByWord = new Map();
log.enableAll();

function doRequest(url) {
  return new Promise((resolve, reject) => {
    log.info(url);
    request.get({
      url: url,
      headers: {
        'Accept': 'text/html'
      }
    }, function(err, response, html) {
      if (response && response.statusCode == 200 && html) {
        resolve(html);
      } else {
        reject();
      }
    });
  });
};

(async function main() {
  for (let kezdo = 0; kezdo < maxKezdo; kezdo += 200) {
    const url = `https://hardverapro.hu/aprok/hardver/?url=&lista_perpage=200&kezdo=${kezdo}`;
  var html=  await doRequest(url);
    const $ = cheerio.load(html);
    var texts = $('#lista_content h5').map(function() {
      return $(this).text();
    }).get();
    texts.forEach(text => text.split(' ')
      .forEach(word => {
        if (countByWord.has(word)) {
          countByWord.set(word, countByWord.get(word) + 1);
        } else {
          countByWord.set(word, 1);
        }
      }));
  }
  log.info(countByWord);
})();
