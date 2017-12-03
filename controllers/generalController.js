var squel = require('squel');

exports.saveUrl = function(req, res){
    req.session.redirectTo = req.originalUrl;
    console.log('savedUrl ' + req.session.redirectTo);
};

exports.getRedirecturl = function(req){
  var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
  return redirectTo;
};

exports.buildSearchQuery = function(req){
  var conditions = [];
  var values = [];
  var Querystr;
  var existence = 0;

   if (typeof req.params.tradeCategory !== 'undefined' &&   req.params.tradeCategory != 'all') {
     var TradeCategory = req.params.tradeCategory;
     if(TradeCategory == 'exchange'){
   		TradeCategory = '교환';
   	}	else if(TradeCategory == 'buy'){
   		TradeCategory = '구매';
   	}	else if(TradeCategory == 'sell'){
   		TradeCategory = '판매';
   	}
     conditions.push("TradeCategory = ?");
     values.push(TradeCategory);
   }

   if (typeof req.query.ItemCategory !== 'undefined') {
     if(req.query.ItemCategory != '전체'){
       conditions.push("ItemCategory = ?");
       values.push(req.query.ItemCategory);
     }
   }

   if (req.query.search) {
    conditions.push("Ihave LIKE ? OR Iwant LIKE ? OR Title LIKE ?");
    for(var i =0;i<3;i++){
      values.push("%" + req.query.search + "%");
    }
  }
 return {
   where: conditions.length ?
            conditions.join(' AND ') : '1',
   values: values
 };
};

exports.getImgSrc = function(TradeData){
  var m,
    imgsrc,
    urls = [],
    str = TradeData.Content;
    // rex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;

    // var re = /<img.*?src='(.*?)'/;
    var re = /<img[^>]*src="([^"]*)"/g;
    var results = re.exec(str);
    if(results){
      imgsrc = results[1];
    } else {
      var ItemCat = TradeData.ItemCatID;
      if(ItemCat == 1){
        imgsrc = '/images/bookseducation.jpeg';
      } else if(ItemCat == 2){
        imgsrc = '/images/books.jpeg';
      } else if(ItemCat == 3){
        imgsrc = '/images/digitalthings.jpg';
      } else if(ItemCat == 4){
        imgsrc = '/images/clothes.jpeg';
      } else if(ItemCat == 5){
        imgsrc = '/images/things.jpeg';
      }
    }
    console.log(imgsrc);
    return imgsrc;
    // while (m = rex.exec(str)){
    //   urls.push(m[1]);
    // }

    // if(urls[0]){
    //   imgsrc = urls[0];
    // }else {
    //   var ItemCat = TradeData.ItemCatID;
    //   if(ItemCat == 1){
    //     imgsrc = '/images/bookseducation.jpeg';
    //   } else if(ItemCat == 2){
    //     imgsrc = '/images/books.jpeg';
    //   } else if(ItemCat == 3){
    //     imgsrc = '/images/digitalthings.jpg';
    //   } else if(ItemCat == 4){
    //     imgsrc = '/images/clothes.jpeg';
    //   } else if(ItemCat == 5){
    //     imgsrc = '/images/things.jpeg';
    //   }
    // } return imgsrc;


};
