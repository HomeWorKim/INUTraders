var pool = require('../config/dbConnection.js');
var general_controller = require('./generalController.js');
var url = require('url');
const { URL, URLSearchParams } = require('url');

exports.trade_list = function(req, res, option){
  var sqlQuery = general_controller.buildSearchQuery(req);
  const myURL = new URL(req.originalUrl, 'https://'+req.hostname);
  myURL.searchParams.set('page','');
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
    connection.query('SELECT COUNT(*) AS "totalRow" FROM TradeListView WHERE ' + sqlQuery.where, sqlQuery.values, function(err, result, fields){
      if(err) throw err;
      var totalRow = result[0].totalRow;
      var limit = 9;
      var offset = 0;
      var currentPage = req.query.page;
      if(typeof currentPage === undefined || (!currentPage)){
        currentPage = parseInt(currentPage);
        currentPage = 1;
        offset = 0;
      }else{
        currentPage = parseInt(currentPage);
        offset = (currentPage-1)*limit;
      }
      var pageLinks = 5;
      var totalPage = Math.ceil(totalRow / limit);
      var firstPageNum = Math.floor((currentPage-1) / pageLinks) * pageLinks + 1;
      var lastPageNum = firstPageNum + (pageLinks-1);
      if(lastPageNum > totalPage){
        lastPageNum = totalPage;
      }
      var pageData = {
        'currentPage' : currentPage,
        'pageLinks' : pageLinks,
        'firstPageNum' : firstPageNum,
        'lastPageNum' : lastPageNum,
        'totalPage' : totalPage
      };
      var redirectBack = general_controller.getRedirecturl(req);
      sqlQuery.values.push(limit);
      sqlQuery.values.push(offset);
      connection.query('SELECT * FROM TradeListView WHERE ' + sqlQuery.where + ' ORDER BY CreatedDate DESC LIMIT ? OFFSET ?', sqlQuery.values, function(err, result, fields){
        console.log('trade_list');
        if(err) throw err;
        res.render('../views/TradeBoard/trade_list', {
          tradeData: result,
          pageData : pageData,
          title: option.title,
          subtitle: option.subtitle,
          path : option.path,
          activeNav : option.activeNav,
          BackURL : redirectBack,
          urlQuery : myURL.search,
          queryData : req.query
        });
      });
      general_controller.saveUrl(req, res);
    });
    connection.release();
  }
  });
};

//
exports.trade_detail = function(req, res, option, callback){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      const myURL = new URL(req.originalUrl, 'https://'+req.hostname);

      connection.query('SELECT * FROM TradeDetailView WHERE TradeID = ?', req.params.TradeID,  function(err, traderesult, fields){
        console.log('trade_detail');
        if(err) throw err;
        connection.query('SELECT * FROM CommentView WHERE TradeID = ?', req.params.TradeID, function(err, commentresult, fields){
          console.log('commente');
          var redirectBack = general_controller.getRedirecturl(req);
          general_controller.saveUrl(req, res);
          res.render('../views/TradeBoard/trade_detail', {
            tradeData: traderesult[0],
            commentData: commentresult,
            title: option.title,
            activeNav : option.activeNav,
            page : req.query.page,
            path : option.path,
            tradeCategory :req.params.tradeCategory,
            BackURL : redirectBack,
            urlQuery : myURL.search
          });
        });

      });
    connection.release();
    }
  });
};


exports.trade_create_get = function(req,res, option){
  var currentPage = req.query.page;
  if(currentPage === undefined){
    currentPage = parseInt(currentPage);
    currentPage = 1;
  }else{
    currentPage = parseInt(currentPage);
  }
  var redirectBack = general_controller.getRedirecturl(req);
  general_controller.saveUrl(req, res);
	res.render("../views/TradeBoard/trade_new",{
		title: option.title,
		path: option.path,
    activeNav : option.activeNav,
    page: currentPage,
    BackURL : redirectBack
	});
};

exports.trade_create_post = function(req, res, option){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      var postdata = {
        'AuthorId' :req.user.UserID,
        'Ihave' : req.body.Trade_Ihave,
        'Iwant' : req.body.Trade_Iwant,
        'Title' : req.body.Trade_Title,
        'Content' : req.body.Trade_Content,
        'TradeCatID' : req.body.Trade_TradeCategory,
        'ItemCatID' : req.body.Trade_ItemCategory
      };

      connection.query('INSERT INTO Trade SET ?', postdata,  function(err, result, fields){
        if(err) throw err;
        var imgsrc = general_controller.getImgSrc(postdata);
        var thumbnaildata = {
          'TradeID' : result.insertId,
          'ImageSrc' : imgsrc
        };
         connection.query("INSERT INTO Thumbnail SET ?", thumbnaildata, function(err, result, fields){
           if(err) throw err;
           res.redirect('/trade/all');
         });
      });
      connection.release();
    }
  });
};

exports.trade_delete = function(req, res, option){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      connection.query('DELETE FROM Trade WHERE TradeID = ?', req.params.TradeID,  function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.redirect('/'+option.path);
      });
      connection.release();
    }
  });
};

exports.trade_update_get = function(req, res, option){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      connection.query('SELECT * FROM Trade WHERE TradeID = ?', req.params.TradeID,  function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.render('../views/TradeBoard/trade_update', {
          tradeData: result[0],
          title: option.title + '수정',
          path: option.path,
          currentPage : req.query.page,
          activeNav : option.activeNav,
          BackURL : req.session.redirectTo
        });
      });
      connection.release();
    }
  });
};


exports.trade_update_post = function(req, res, option){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      var updateData = {
        'Ihave' : req.body.Trade_Ihave,
        'Iwant' : req.body.Trade_Iwant,
        'Title' : req.body.Trade_Title,
        'Content' : req.body.Trade_Content,
        'TradeCatID' : req.body.Trade_TradeCategory,
        'ItemCatID' : req.body.Trade_ItemCategory,
      };
      connection.query('UPDATE Trade SET ? WHERE TradeID = ?', [updateData, req.params.TradeID],  function(err, result, fields){
        if(err) throw err;
        var imgsrc = general_controller.getImgSrc(updateData);
        var thumbnaildata = {
          'ImageSrc' : imgsrc
        };
         connection.query("UPDATE Thumbnail SET ? WHERE TradeID = ?", [thumbnaildata, req.params.TradeID] , function(err, result, fields){
           if(err) throw err;
        console.log(result);
        res.redirect('/'+option.path);
      });
    });
    }
    connection.release();
  });
};

exports.trade_close = function(req, res, option){
  const myURL = new URL(req.originalUrl, 'https://'+req.hostname);
  myURL.searchParams.delete('_method');
  console.log(myURL.search);
  console.log('close:'+ '/'+option.path+"/"+req.params.TradeID + myURL.search);
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      var updateData = {
        'TradeStatus' : 0
      };
      connection.query('UPDATE Trade SET ? WHERE TradeID = ?', [updateData, req.params.TradeID],  function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.redirect('/'+option.path+"/"+req.params.TradeID + myURL.search);
      });
    }
    connection.release();
  });
};

//For Comment
exports.trade_comment_post = function(req, res, option){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      var postdata = {
        'UserID' :req.user.UserID,
        'TradeID' : req.params.TradeID,
        'CommentContent' : req.body.Comment_Content,
      };

      connection.query('INSERT INTO Comment SET ?', postdata,  function(err, result, fields){
        if(err) throw err;
        console.log(result);
        var redirectTo = general_controller.getRedirecturl(req);
        console.log('comment redirectTo' + redirectTo);
        res.redirect(redirectTo);
      });
      connection.release();
    }
  });
};

exports.trade_comment_delete = function(req, res, option){
  pool.getConnection(function(err, connection){
    if(err) throw err;
    else{
      connection.query('DELETE FROM Comment WHERE CommentID = ?', req.params.CommentID,  function(err, result, fields){
        if(err) throw err;
        console.log(result);
        var redirectTo = general_controller.getRedirecturl(req);
        res.redirect(redirectTo);
      });
      connection.release();
    }
  });
};
