import mongoose from 'mongoose';
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },

    // ⬇️ Adım 8: Bu kontaktın hangi kullanıcıya ait olduğunu gösterir
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
contactSchema.index(
  { userId: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true, $type: 'string' } },
  },
);

// 3. argümanla koleksiyon adını sabitliyoruz (pluralizasyon sürprizi olmasın)
export const Contact = mongoose.model('Contact', contactSchema, 'contacts');
export default Contact;
