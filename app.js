// 年齢群団を0-4歳に変更、かつ　増減者数を追加


'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {}});
const map = new Map(); // key: 都道府県　value: 集計データのオブジェクト
const nenrei = 22; //年齢群団を示す数値　下の通り　
// 4=0~4, 5=5~9, 6=10~14, 7=15~19, 8=20~24, 9=25~29, 10=30~34, 11=35~39, 12=40~44
//13=45~49, 14=50~54, 15=55~59, 16=60~64, 17=65~69, 18=70~74, 19=75~79, 20=80~84
//21=85~89, 22=90~
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[nenrei]);
    if (year === 2010 || year === 2015){
      let value = map.get(prefecture);
      if (!value){
         value = {
           popu10: 0,
           popu15: 0,
           popudiff: null,
           change: null
         };
      }
      if (year === 2010){
        value.popu10 += popu;
      }
      if (year === 2015){
        value.popu15 += popu;
      }
      map.set(prefecture,value);
     }
});
rl.resume();


rl.on('close',() => {
    for (let pair of map){
      const value = pair[1];
      value.popudiff = value.popu15 - value.popu10;
      value.change = value.popu15/value.popu10;
    }
//変化率でソートするとき
//    const rankingArray = Array.from(map).sort((pair1, pair2) => {
//      return pair2[1].change - pair1[1].change;
//増減者数でソートするとき
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].popudiff - pair1[1].popudiff;
    });
    const rankingStrings = rankingArray.map((pair, i) => {
      return (i+1)+'位 '+ pair[0] + ': ' + pair[1].popu10 + ': ' + pair[1].popu15 +
      '   増減者数: '+ pair[1].popudiff + ' 変化率: ' + pair[1].change;
    })
    console.log(rankingStrings);

});
