var squel = require('squel');

exports.saveUrl = function(req, res){
  console.log("1redirectto : " +req.session.redirectTo);
    console.log("original : " + req.originalUrl);
    req.session.redirectTo = req.originalUrl;
    console.log(req.session.redirectTo);
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

 // squel.select().field('*').from('TradeListView').where()


 return {
   where: conditions.length ?
            conditions.join(' AND ') : '1',
   values: values
 };
};
