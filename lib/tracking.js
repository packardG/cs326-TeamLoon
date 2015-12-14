var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds053164.mongolab.com:53164/unicorns', ['trackingDB'], {authMechanism: 'ScramSHA1'});

// taken from https://github.com/mafintosh/mongojs
db.on('error', function (err) {
    console.log('database error', err)
})

function updateVideo(videoURL, sa, ska) {
  db.trackingDB.findOne({url : videoURL}, function(err, doc) {
      var resultSuggest = sa;
      var resultSkip = ska;
      if (doc) {
        resultSuggest = doc.suggestCount+sa;
        resultSkip = doc.skipCount+ska;
        db.trackingDB.update({url: videoURL}, {$set : {suggestCount : resultSuggest, skipCount : resultSkip}}, function (){});
      }
      else {
        db.trackingDB.insert({url: videoURL, suggestCount : resultSuggest, skipCount : resultSkip});
      }
  })
}
exports.updateVideo = updateVideo;
