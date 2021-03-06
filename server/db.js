var multer = require('multer');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, global.env.public + 'images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var pub = {};
pub.upload = multer({ storage: storage });



pub.insertPost = function( post ) {
  return new Promise(function (resolve, reject) {
    global.db.collection( global.conf.DB_COLLECTION_POSTS )
      .insertAsync( post )
      .then(function() {
        resolve();
      });
  });
}

pub.updatePost = function( post ) {
  return new Promise(function (resolve, reject) {
    global.db.collection( global.conf.DB_COLLECTION_POSTS )
      .updateAsync({
        '_id' : ObjectId(post.id)
      }, post)
      .then(function() {
        resolve();
      });
  });
}

pub.getPosts = function( opts, limit, isDynamic ) {
  return new Promise(function (resolve, reject) {
    global.db.collection( global.conf.DB_COLLECTION_POSTS )
      .findAsync( opts, limit )
      .then(function( cursor ) {
        return cursor.toArrayAsync();
      })
      .then(function( posts ) {
        posts.forEach( function( post ) { addPostProperties( post, isDynamic ); } );
        resolve( posts );
      });
  });
}

function addPostProperties( post, isDynamic ) {
  var d = moment( post.date );
  post.url = '/blog/' + d.format('YYYY_MM_DD');
  post.humanDate = d.format('D MMM YYYY');
  post.date = d.format('YYYY-MM-DD')
  post.isDynamic = isDynamic;
  post.id = post._id;

  var i = 0;
  var len = post.media.length;
  var media;
  for ( i = 0; i < len; i++ ) {
    media = post.media[ i ];
    media.aspect = 100 * (media.height / media.width);
    if ( media.type === 'video' ) {
      media.isVideo = true;
    }
    if (media.type === 'image') {
      media.isImage = true;
    }
    if (media.type === 'youtube') {
      media.isYoutube = true;
    }
    if ( i === 0 ) {
      media.srcName = 'first';
    } else if ( i === 1) {
      media.srcName = 'second';
    } else if ( i === 2) {
      media.srcName = 'third';
    }
  }


  if ( post.template === 'left_bottom' ) {
    post.isLeftBottom = true;
  }
  if ( post.template === 'left_gallery' ) {
    post.isLeftGallery = true;
  }
  if ( post.template === 'centered_bottom' ) {
    post.isCenteredBottom = true;
  }

}

module.exports = pub;