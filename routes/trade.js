var express= require('express');
var router = express.Router();
var mysql = require('mysql');
var trade_controller = require('../controllers/tradeController');
var general_controller = require('../controllers/generalController');
var async = require('async');

var All_Option = {
	title : 'All',
	subtitle: '모든 거래',
	path : 'trade/all',
	activeNav : 'All'
};

var Exchange_Option = {
	title:'Exchange',
	subtitle: '교환',
	path:'trade/exchange',
	activeNav:'Exchange'
};

var Buy_Option = {
	title : 'Buy',
	subtitle: '구매',
	path : 'trade/buy',
	activeNav : 'Buy'
};

var Sell_Option = {
	title : 'Sell',
	subtitle: '판매',
	path : 'trade/buy',
	activeNav : 'Sell'
};


var Option;

function selectOption(tradeCategory){
	if(tradeCategory == 'all'){
		Option = All_Option;
	}	else if(tradeCategory == 'exchange'){
		Option = Exchange_Option;
	}	else if(tradeCategory == 'buy'){
		Option = Buy_Option;
	}	else if(tradeCategory == 'sell'){
		Option = Sell_Option;
	}
}


router.get('/:tradeCategory', function(req, res, next){
	async.series([
		function(callback){
			selectOption(req.params.tradeCategory);
			callback(null);
		}, function(callback){
			trade_controller.trade_list(req, res, Option);
		}
	]);
});//index

router.get('/:tradeCategory/create', function(req, res){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_create_get(req, res, Option);
});

router.post('/:tradeCategory/create', function(req, res){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_create_post(req, res, Option);
});

router.get('/:tradeCategory/:TradeID', function(req, res, next){
	async.series([
		function(callback){
			selectOption(req.params.tradeCategory);
			callback(null);
		}, function(callback){
			trade_controller.trade_detail(req, res, Option, callback);
			callback(null);
		}
	]);
});

router.get('/:tradeCategory/:TradeID/update', function(req, res, next){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_update_get(req, res, Option);
});

router.put('/:tradeCategory/:TradeID/update', function(req, res){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_update_post(req, res, Option);
});

router.delete('/:tradeCategory/:TradeID', function(req, res){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_delete(req, res, Option);
});

router.put('/:tradeCategory/:TradeID', function(req, res){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_close(req, res, Option);
});

//For Comment
router.post('/:tradeCategory/:TradeID/comment', function(req, res){
	trade_controller.trade_comment_post(req, res, Option);
});

router.delete('/:tradeCategory/:TradeID/comment/:CommentID', function(req, res){
	selectOption(req.params.tradeCategory);
	trade_controller.trade_comment_delete(req, res, Option);
});

module.exports = router;
