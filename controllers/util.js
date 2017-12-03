// var util = {};
//
// util.isLoggedin = function(req,res,next){
// 	if(req.isAuthenticated() && req.user.admin <= 4){
// 		next();
// 	}else{
// 		req.flash("errors", {login:"Please login first"});
//   		res.redirect("/");
// 	}
// };//Only login test
//
// util.isadminThree = function(req,res,next){
// 	if(req.isAuthenticated() && req.user.admin <= 3){
// 		next();
// 	}else{
// 		req.flash("errors", {login:"Not admin"});
//   		res.redirect("/");
// 	}
// };//all member&login test
//
// util.isadminTwo = function(req,res,next){
// 	if(req.isAuthenticated() && req.user.admin <= 2){
// 		next();
// 	}else{
// 		req.flash("errors", {login:"Not admin"});
//   		res.redirect("/");
// 	}
// };//club president&admin & login test
//
// util.isadminOne = function(req,res,next){
// 	if(req.isAuthenticated() && req.user.admin===1){
// 		next();
// 	}else{
// 		req.flash("errors", {login:"Not admin"});
//   		res.redirect("/");
// 	}
// };//Only admin possible & login test
//
// util.isPossibleDelete = function(req,res,next){
// 	if((req.isAuthenticated() && req.user.admin <= 3) || req.user.admin ==1){
// 		next();
// 	}else{
// 		req.flash("errors", {login:"Not admin"});
//   		res.redirect("/");
// 	}
// };//administer && post_author(just first confirm... look route.delete's function!)
//
// util.createSearch = function(queries){
// 	var searchType=queries.searchType;
// 	var findText={};
// 	var findUser=null;
// 	var postQuery=[];
// 	if(queries.searchType && queries.searchText && queries.searchText.length >0){
// 		//javascript indexOf(찾는이름) 없으면 -1 있으면 0이상의 수
// 		if(searchType.indexOf("title")>=0){
// 			postQuery.push({title:{$regex:new RegExp(queries.searchText,"i")}});
// 		}
// 		if(searchType.indexOf("name")>=0){
// 			postQuery.push({name:{$regex:new RegExp(queries.searchText,"i")}});
// 		}
// 		if(searchType.indexOf("year")>=0){
// 			postQuery.push({year:{$regex:new RegExp(queries.searchText,"i")}});
// 		}
// 		if(searchType.indexOf("state")>=0){
// 			postQuery.push({state:{$regex:new RegExp(queries.searchText,"i")}});
// 		}
// 		if(searchType.indexOf("grade")>=0){
// 			postQuery.push({grade:{$regex:new RegExp(queries.searchText,"i")}});
// 		}
// 		if(searchType.indexOf("author")>=0){
// 			findUser={name:{$regex:new RegExp(queries.searchText,"i")}};
// 		}
// 	}
// 		if(postQuery.length>0) findText = {$or:postQuery};
// 	return {searchType:queries.searchType, searchText:queries.searchText, findText:findText, findUser:findUser};
// };
//
// util.parseError = function(errors){
//  var parsed = {};
//  if(errors.name == 'ValidationError'){
//   for(var name in errors.errors){
//    var validationError = errors.errors[name];
//    parsed[name] = { message:validationError.message };
//  } // mongoose에서 발생하는 validationError message를 변환
//  } else if(errors.code == "11000" ) {
//    if(errors.errmsg.indexOf("id") > 0){
//      parsed.id = { message:"이미 존재하는 아이디 입니다." };
//    } else if(errors.errmsg.indexOf("tel") > 0){
//      parsed.tel = { message:"이미 존재하는 번호 입니다." };
//    } else if(errors.errmsg.indexOf("mail") > 0){
//      parsed.mail = { message:"이미 존재하는 e-mail 입니다." };
//    }
//   // mongoDB에서 id의 error를 처리
//  } else {
//   parsed.unhandled = JSON.stringify(errors);
//  }
//  return parsed;
// };
//
//
// module.exports = util;
