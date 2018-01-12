//////////////////////////////////////////////////////////////////////
// ECHONET Lite
var EL = require('./echonet-lite.js');
 
var airconObjAll = '013000';
var airconObjCode = '013001';
var objList = [airconObjCode];

var makerCode = '00000b';
var macAddress = '000c2942c1a1';
 
// 自分のエアコンのデータ，今回はこのデータをグローバル的に使用する方法で紹介する．
var airconObj = {
    // super
    "80": [0x30],  // 動作状態
    "81": [0xff],  // 設置場所
    "82": [0x00, 0x00, 0x47, 0x00], // Release G
    "88": [0x42],  // 異常状態
    //"8a": [0x00, 0x00, 0x00], // maker code
    //"8a": [0x00, 0x00, 0x0b], // maker code
    "9d": [0x04, 0x80, 0x8f, 0xa0, 0xb0],        // inf map, 1 Byte目は個数
    "9e": [0x04, 0x80, 0x8f, 0xa0, 0xb0],        // set map, 1 Byte目は個数
    "9f": [0x0d, 0x80, 0x81, 0x82, 0x88, 0x8a, 0x8f, 0x9d, 0x9e, 0x9f, 0xa0, 0xb0, 0xb3, 0xbb], // get map, 1 Byte目は個数
    // child
    "8f": [0x41], // 節電動作設定
    "a0": [0x31], // 風量設定
    "b0": [0x41], // 運転モード設定
    "b3": [0x19], // 温度設定値
    "bb": [0x1a] // 室内温度計測値
};
 
// ノードプロファイルに関しては内部処理するので，ユーザーはエアコンに関する受信処理だけを記述する．
var elsocket = EL.initialize(objList, 4, makerCode, macAddress, function(rinfo, els) {

    // object毎にmaker code、identifierを初期化
    if (airconObj["8a"] == null) {
        airconObj["8a"] = [].concat(EL.Node_details["8a"]);
    }
    if (airconObj["83"] == null) {
        ident = EL.Node_details["83"].slice(0, 6);
	ident = ident.concat(EL.toHexArray(airconObjCode));
        ident = ident.concat(EL.Node_details["83"].slice(9, 17));
        airconObj["83"] = ident;
	// console.log(airconObj["83"]);
    }

    // コントローラがGetしてくるので，対応してあげる
    // エアコンを指定してきたかチェック
    if( els.DEOJ == airconObjAll || els.DEOJ == airconObjCode ) {
        // ESVで振り分け，主に0x60系列に対応すればいい
        switch( els.ESV ) {
            ////////////////////////////////////////////////////////////////////////////////////
            // 0x6x
          case EL.SETI: // "60
            break;
          case EL.SETC: // "61"，返信必要あり
            break;
 
          case EL.GET: // 0x62，Get
	    EL.sendGetRes(rinfo.address, EL.toHexArray(airconObjCode), EL.toHexArray(els.SEOJ), els, airconObj);
            break;
 
          case EL.INFREQ: // 0x63
            break;
 
          case EL.SETGET: // "6e"
            break;
 
          default:
            // console.log( "???" );
            // console.dir( els );
            break;
        }
    }
});
 
//////////////////////////////////////////////////////////////////////
// 全て立ち上がったのでINFでエアコンONの宣言
//EL.sendOPC1( '224.0.23.0', [0x01,0x30,0x01], [0x0e,0xf0,0x01], 0x73, 0x80, [0x30]);
