'use strict';

const {convertXML} = require('simple-xml-to-json');

function simplifyJson(obj) {
  const keys = Object.keys(obj);
  const firstProperty = keys[0];
  if (obj[firstProperty].children) {
    let result = {};
    obj[firstProperty].children.forEach(c => {
      let firstProp = Object.keys(c)[0].match(/(.+:)?(.+)/)[2];
      result[firstProp] = simplifyJson(c);
    });
    return result;
  } else {
    let firstProp = Object.keys(obj[firstProperty]).filter(skipKeys)[0].match(/(.+:)?(.+)/)[2];
    if (firstProp === 'nil') return null;
    if (obj[firstProperty][firstProp] === 'true') return true;
    if (obj[firstProperty][firstProp] === 'false') return false;
    return obj[firstProperty][firstProp];
  }
}

function skipKeys(k) {
  return !['xml:lang'].includes(k);
}

module.exports = {
  toJSON(xml) {
    return convertXML(xml);
  },
  toSimpleJSON(xml) {
    const json = convertXML(xml);
    return simplifyJson(json);
  },
};
