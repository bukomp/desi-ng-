import mongoose, { Schema } from 'mongoose';

const noteSchema: Schema<any> = new mongoose.Schema({
  content: String,
  header: String,
  favorite: Boolean,
  dateOfCreation: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

noteSchema.set('toJSON', {
  // rObj = object that being returned
  transform: (document, rObj) => {
    rObj.id = rObj._id.toString();
    delete rObj._id;
    delete rObj.__v;
  },
});

export const Notes: mongoose.Model<mongoose.Document, {}> = mongoose.model('Note', noteSchema);
