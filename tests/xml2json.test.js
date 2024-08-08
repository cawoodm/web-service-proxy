'use strict';

const fs = require('fs');
const assert = require('assert');
const path = require('path');
const xml2json = require('../src/xml2json');

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json1.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Body.ChangePasswordResponse.ChangePasswordResult.Message === null);
  assert(res.Body.ChangePasswordResponse.ChangePasswordResult.Status === true);
  console.log('✅ XML2JSON Test 1');
})();

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json2.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Body.ChangePasswordResponse.ChangePasswordResult.Message === 'Error!');
  assert(res.Body.ChangePasswordResponse.ChangePasswordResult.Status === false);
  console.log('✅ XML2JSON Test 2');
})();

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json3.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Header.RequestHeader.networkCode === '123456');
  assert(res.Body.getAdUnitsByStatement.filterStatement.query.match(/^WHERE/));
  console.log('✅ XML2JSON Test 3');
})();

(function () {
  const xml = fs.readFileSync(path.join(__dirname, './xml2json4.xml')).toString();
  let res = xml2json.toSimpleJSON(xml);
  assert(res.Body.Fault.faultcode === 's:Client');
  assert(res.Body.Fault.faultstring === 'Wrong user name or password!');
  console.log('✅ XML2JSON Test 4');
})();
