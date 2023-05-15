import mongoose, { Schema } from 'mongoose';

const userSchema: Schema<any> = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  dateOfRegistration: Date,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

userSchema.set('toJSON', {
  // rObj = object that being returned
  transform: (document, rObj) => {
    rObj.id = rObj._id.toString();
    delete rObj._id;
    delete rObj.__v;
  },
});

export const Users: mongoose.Model<mongoose.Document, {}> = mongoose.model('User', userSchema);
