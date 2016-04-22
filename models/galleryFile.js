var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var collectionName = 'galleryFiles';

var gallerySchema = new Schema({
        filename: {type: String, required: true},
        thumb_file_path: {type: String, required: true},
        obj_file_path: {type: String, required: true},
        uploaded_at: Date
    },
    {
        collection: collectionName
    });

gallerySchema.plugin(mongoosePaginate);

// add custom methods
// Get city and country
// messageSchema.methods.name = function() {};mo


var GalleryFile = mongoose.model('GalleryFile', gallerySchema);

module.exports = GalleryFile;