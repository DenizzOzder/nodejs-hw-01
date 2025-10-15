import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    // select:false -> JSON/queries'de default gizli olur (login'de +password ile seçersin)
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// JSON'a çevrilirken password'u sil
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// (opsiyonel) toObject için de aynı kuralı istersen:
userSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const UserCollection = mongoose.model('Users', userSchema, 'users');
export default UserCollection;
