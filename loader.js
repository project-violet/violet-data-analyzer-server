//===----------------------------------------------------------------------===//
//
//                         Violet Server Data Analyzer
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const {promisify} = require('util');

const a_database = require('./api/database');
const m_kdtree = require('./kdtree');

function rank_connectom(results) {
  console.log(results.length);

  var userData = {};
  for (var i = 0; i < results.length; i++) {
    if (!(results[i].UserAppId in userData))
      userData[results[i].UserAppId] = new Set();
    userData[results[i].UserAppId].add(results[i].ArticleId);
  }

  var articleData = {};
  Object.keys(userData).forEach(function(key) {
    for (var article1 of userData[key].values()) {
      if (!(article1 in articleData)) articleData[article1] = {};
      for (var article2 of userData[key]) {
        if (article1 == article2) continue;
        if (!(article2 in articleData[article1]))
          articleData[article1][article2] = 0;
        articleData[article1][article2]++;
      }
    }
  });

  var t_rank = [];
  Object.keys(articleData).forEach(function(article1) {
    Object.keys(articleData[article1]).forEach(function(article2) {
      if (articleData[article1][article2] > 1 &&
          Math.abs(parseInt(article1) - parseInt(article2)) > 1) {
        t_rank.push([articleData[article1][article2], article1, article2]);
      }
    });
  });

  t_rank.sort(function(a, b) {
    return a[0] - b[0];
  });
  for (var e of t_rank) console.log(e);
}

var user_sim_dic = {};


function _build_similarity_query(results) {
  var userData = {};
  for (var i = 0; i < results.length; i++) {
    if (!(results[i].UserAppId in userData))
      userData[results[i].UserAppId] = new Set();
    userData[results[i].UserAppId].add(results[i].ArticleId);
  }

  Object.keys(userData).forEach(function(user1) {
    var articles1 = userData[user1].values();
    var set1 = new Set();

    for (var article of articles1) set1.add(article);

    user_sim_dic[user1] = {};

    Object.keys(userData).forEach(function(user2) {
      if (user1 == user2) return;

      var articles2 = userData[user2].values();
      var set2 = new Set();

      for (var article of articles2) set2.add(article);

      var couple = 0;
      var only2 = 0;

      for (var article of set2)
        if (set1.has(article))
          couple += 1;
        else
          only2 += 1;

      var only1 = set1.size - couple;

      if (couple == 0) return;

      user_sim_dic[user1][user2] =
          [couple / (only1 + only2 + couple), set1.size, set2.size];
    });

    var user_sim_dic_user = user_sim_dic[user1];
    var user_sim_arr = [];

    for (var e in user_sim_dic_user.keys()) {
      user_sim_arr.push([
        e, user_sim_dic_user[e][0], user_sim_dic_user[e][1],
        user_sim_dic_user[e][2]
      ]);
    }

    user_sim_arr.sort((a, b) => b[1] - a[1]);
  });

  console.log('query ready to use!');
}


function similarity_query(userAppId) {
  if (!(userAppId in user_sim_tree)) {
    return '';
  }
}


var conn = a_database();

var qr = conn.query(
    'SELECT * FROM viewtotal WHERE UserAppId IS NOT NULL AND UserAppId <> "test"',
    function(error, results, fields) {
      console.log(error);
      _build_similarity_query2(results);
    });

module.exports = {
  similarity_query: similarity_query
};