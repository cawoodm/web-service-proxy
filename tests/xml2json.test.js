const fs = require('fs');
const assert = require('assert');
const path = require('path');
const xml2json = require('../src/xml2json');

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json1.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Body.ChangePasswordResponse.ChangePasswordResult.Status === "true");
  console.log('✅ XML2JSON Test 1')
})();

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json2.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Body.GetStockPriceResponse.Price === "34.5");
  console.log('✅ XML2JSON Test 2')
})();

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json3.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Header.RequestHeader.networkCode === "123456");
  assert(res.Body.getAdUnitsByStatement.filterStatement.query.match(/^WHERE/));
  console.log('✅ XML2JSON Test 3')
})();