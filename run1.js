var EL=require('./echonet-lite.js');

// var objList=['026f01'];

var eLockObjAll = '026f00';
var eLockObjCode = '026f01';
var jemaObjAll = '05fd00';
var jemaObjCode = '05fd01';
var wShutterObjAll = '026300';
var wShutterObjCode = '026301';
var gLightingObjAll = '029000';
var gLightingObjCode = '029001';
var objList = [eLockObjCode, jemaObjCode, wShutterObjCode, gLightingObjCode];

var makerCode = '00000b';
var macAddress = '000c2942c1a1';

var eLockObj = {
    // super
    "80": [0x30],  // 動作状態
    "81": [0xff],  // 設置場所
    "82": [0x00, 0x00, 0x47, 0x00], // Release G
    "88": [0x42],  // 異常状態
    "9d": [0x02, 0x80, 0x81], // inf map, 1 Byte目は個数
    "9e": [0x01, 0xe0],       // set map, 1 Byte目は個数
    "9f": [0x02, 0x80, 0xe0], // get map, 1 Byte目は個数
    // child
    "e0": [0x41]   // 施錠設定
};

var jemaObj = {
    // super
    "80": [0x30],  // 動作状態
    "81": [0xff],  // 設置場所
    "82": [0x00, 0x00, 0x47, 0x00], // Release G
    // "83"
    "88": [0x42],  // 異常状態
    // "8a"
    "9d": [0x03, 0x80, 0x81, 0x88], // inf map, 1 Byte目は個数
    "9e": [0x01, 0x80],     // set map, 1 Byte目は個数
    "9f": [0x0a, 0x80, 0x81, 0x82, 0x83, 0x88, 0x8a, 0x9d, 0x9e, 0x9f, 0xe0], // get map, 1 Byte目は個数
    // child
    "e0": [0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41]   // 機器名
};

var wShutterObj = {
    // super
    "80": [0x30],  // 動作状態
    "81": [0xff],  // 設置場所
    "82": [0x00, 0x00, 0x47, 0x00], // Release G
    // "83"
    "88": [0x42],  // 異常状態
    // "8a"
    "9d": [0x02, 0x80, 0xe0], // inf map, 1 Byte目は個数
    "9e": [0x01, 0xe0],     // set map, 1 Byte目は個数
    "9f": [0x0a, 0x80, 0x81, 0x82, 0x83, 0x88, 0x8a, 0x9d, 0x9e, 0x9f, 0xe0], // get map, 1 Byte目は個数
    // child
    "e0": [0x43]   // 開(41)、閉(42)、停止(43)
};

var gLightingObj = {
    // super
    "80": [0x30],  // 動作状態
    "81": [0xff],  // 設置場所
    "82": [0x00, 0x00, 0x47, 0x00], // Release G
    // "83"
    "88": [0x42],  // 異常状態
    // "8a"
    "9d": [0x01, 0x80], // inf map, 1 Byte目は個数
    "9e": [0x02, 0x80, 0xb6],     // set map, 1 Byte目は個数
    "9f": [0x0a, 0x80, 0x81, 0x82, 0x83, 0x88, 0x8a, 0x9d, 0x9e, 0x9f, 0xb6], // get map, 1 Byte目は個数
    // child
    "b6": [0x42]   // 点灯モード
};

// ノードプロファイルに関しては内部処理するので，ユーザーは対象に関する受信処理だけを記述する．
var elsocket = EL.initialize(objList, 4, makerCode, macAddress, function(rinfo, els) {

    // object毎にmaker code、identifierを初期化
    if (eLockObj["8a"] == null) {
        eLockObj["8a"] = [].concat(EL.Node_details["8a"]);
    }
    if (eLockObj["83"] == null) {
        ident = EL.Node_details["83"].slice(0, 6);
        ident = ident.concat(EL.toHexArray(eLockObjCode));
        ident = ident.concat(EL.Node_details["83"].slice(9, 17));
        eLockObj["83"] = ident;
    }

    if (jemaObj["8a"] == null) {
        jemaObj["8a"] = [].concat(EL.Node_details["8a"]);
    }
    if (jemaObj["83"] == null) {
        ident = EL.Node_details["83"].slice(0, 6);
        ident = ident.concat(EL.toHexArray(jemaObjCode));
        ident = ident.concat(EL.Node_details["83"].slice(9, 17));
        jemaObj["83"] = ident;
    }

    if (wShutterObj["8a"] == null) {
        wShutterObj["8a"] = [].concat(EL.Node_details["8a"]);
    }
    if (wShutterObj["83"] == null) {
        ident = EL.Node_details["83"].slice(0, 6);
        ident = ident.concat(EL.toHexArray(wShutterObjCode));
        ident = ident.concat(EL.Node_details["83"].slice(9, 17));
        wShutterObj["83"] = ident;
    }

    if (gLightingObj["8a"] == null) {
        gLightingObj["8a"] = [].concat(EL.Node_details["8a"]);
    }
    if (gLightingObj["83"] == null) {
        ident = EL.Node_details["83"].slice(0, 6);
        ident = ident.concat(EL.toHexArray(gLightingObjCode));
        ident = ident.concat(EL.Node_details["83"].slice(9, 17));
        gLightingObj["83"] = ident;
    }

    // コントローラがGetしてくるので，対応してあげる
    // 対象機器を指定してきたかチェック
    if(els.DEOJ == eLockObjAll || els.DEOJ == eLockObjCode) {
        // ESVで振り分け，主に0x60系列に対応すればいい
        switch( els.ESV ) {
            ////////////////////////////////////////////////////////////////////////////////////
            // 0x6x
          case EL.SETI: // "60
            break;
          case EL.SETC: // "61"，返信必要あり
            break;
 
          case EL.GET: // 0x62，Get
	    EL.sendGetRes(rinfo.address, EL.toHexArray(eLockObjCode), EL.toHexArray(els.SEOJ), els, eLockObj);
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

    if(els.DEOJ == jemaObjAll || els.DEOJ == jemaObjCode) {
        // ESVで振り分け，主に0x60系列に対応すればいい
        switch( els.ESV ) {
            ////////////////////////////////////////////////////////////////////////////////////
            // 0x6x
          case EL.SETI: // "60
            break;
          case EL.SETC: // "61"，返信必要あり
            break;
 
          case EL.GET: // 0x62，Get
	    EL.sendGetRes(rinfo.address, EL.toHexArray(jemaObjCode), EL.toHexArray(els.SEOJ), els, jemaObj);
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

    if(els.DEOJ == wShutterObjAll || els.DEOJ == wShutterObjCode) {
        // ESVで振り分け，主に0x60系列に対応すればいい
        switch( els.ESV ) {
            ////////////////////////////////////////////////////////////////////////////////////
            // 0x6x
          case EL.SETI: // "60
            break;
          case EL.SETC: // "61"，返信必要あり
            break;
 
          case EL.GET: // 0x62，Get
	    EL.sendGetRes(rinfo.address, EL.toHexArray(wShutterObjCode), EL.toHexArray(els.SEOJ), els, wShutterObj);
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

    if(els.DEOJ == gLightingObjAll || els.DEOJ == gLightingObjCode) {
        // ESVで振り分け，主に0x60系列に対応すればいい
        switch( els.ESV ) {
            ////////////////////////////////////////////////////////////////////////////////////
            // 0x6x
          case EL.SETI: // "60
            break;
          case EL.SETC: // "61"，返信必要あり
            break;
 
          case EL.GET: // 0x62，Get
	    EL.sendGetRes(rinfo.address, EL.toHexArray(gLightingObjCode), EL.toHexArray(els.SEOJ), els, gLightingObj);
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

//EL.sendOPC1('224.0.23.0', [0x02,0x6f,0x01], [0x0e,0xf0,0x01], 0x73, 0x80, [0x30]);
