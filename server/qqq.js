const axios = require('axios');
const _ = require('lodash');
let orgs = require('./qq')
const models = require('./models')

const fs = require('fs');
const OrgM = models['Org'];

const terms = require('./terms');
const partners = require('./partners');
var isNumber = new RegExp('[1-9]\d*|0\d+');
async function start() {
  let newAllOrg=[];
  let allOrg = await OrgM.findAll({
    // limit: 1000
  })


  for (org of allOrg) {

    let newOrg = {};
    let Org = org.toJSON()

    let arr1 = Org['name'].split(' : ');
    if (arr1.length < 2)
      arr1 = Org['name'].split(': ');
    newOrg['id'] = Org['id']

    newOrg['name'] = _.find(partners, function (o) {
      return o.id == Org['pid']
    }).name;
    newOrg['category'] = arr1[0];
    newOrg['state'] = arr1[1];
    newOrg['district'] = arr1[2];
    if (isNumber.test(newOrg['district'])) {
      newOrg['district'] = _.find(terms, function (o) {
        return o.id == Org['did']
      }).name;
    }
    newOrg['phone'] = Org['phone'];
    newOrg['link'] = Org['link'];
    newOrg['address'] = Org['address'];
    let arrT = Org['t'].split(',');
    for (t of arrT) {
      let tObj = _.find(terms, function (o) {
        return o.id == t
      });
      if (tObj != undefined) {
        if (tObj.tid == '3')
          newOrg['nationality'] = newOrg['nationality'] != undefined ? newOrg['nationality'] += "-" + tObj.name : newOrg['nationality'] = tObj.name;
        if (tObj.tid == '5')
          newOrg['coverage'] = newOrg['coverage'] != undefined ? newOrg['coverage'] += "-" + tObj.name: newOrg['coverage'] = tObj.name;
        if (tObj.tid == '16')
          newOrg['required_documents'] = newOrg['required_documents'] != undefined ? newOrg['required_documents'] += "-" + tObj.name : newOrg['required_documents'] = tObj.name;

      }

    }

    newAllOrg.push(newOrg)
  }
  fs.writeFile("./newAllOrg.json", JSON.stringify(newAllOrg), function (err) {
    if (err) {
      console.log(err);
    }
  })
}


start().catch(error => console.log(error.stack));





// const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

// async function getAll(orgs, newOrgs) {
//   const url = 'https://turkey.servicesadvisor.org/api/services/item/'


//   for (let i = 0; i < orgs.length; i++) {
//     const org = orgs[i];

//     try {

//       axios.defaults.headers.common['Auth-Token'] = 'foo bar' + org.oid;
//       const response = await axios.get(url + org.oid);
//       const newOrg = _.assign(org, response.data.data)
//       await waitFor(2000);

//       await OrgM.upsert(newOrg);

//     } catch (error) {
//       console.error(error);
//     }

//   }

// }

// async function doSo() {

//   orgs = _.take(_.drop(orgs, 2900), 100);
// let newOrgs = [];
// await getAll(orgs, newOrgs)

// }
// for (let index = 0; index < array.length; index++) {
//   const element = array[index];

// }
