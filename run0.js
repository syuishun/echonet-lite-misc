var EL=require('./echonet-lite.js');
var objList=['05ff02'];
var makerCode = '00000b';
var macAddress = '000c2942c1a1';

var elsocket = EL.initialize(objList, 4, makerCode, macAddress, function(rinfo, els) {
  console.dir(rinfo);
  console.dir(els);
});

EL.search();
