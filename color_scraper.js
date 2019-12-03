var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true }); 
var fs = require('fs');

nightmare
  .goto('https://www.random.org/colors/hex')
  .wait('.btn-primary')
  .click('#color-generate-button')
  .wait('.color-code-black')
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .click('#color-generate-button')
  .wait(1000)
  .evaluate(function () {
    var colorNodes = document.querySelectorAll('.color-code-black');
    var list = [].slice.call(colorNodes);
    return list.map(function(node){
      return node.innerText
    });
  })
  .end()
  .then(function (list) {
    fs.writeFileSync('colors.json', JSON.stringify(list))
    console.log('done');
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });