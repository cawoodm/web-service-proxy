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
    let firstProp = Object.keys(obj[firstProperty])[0].match(/(.+:)?(.+)/)[2];
    return obj[firstProperty][firstProp];
  }
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
