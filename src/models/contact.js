import mongoose from 'mongoose';
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// 3. argümanla koleksiyon adını sabitliyoruz (pluralizasyon sürprizi olmasın)
export const Contact = mongoose.model('Contact', contactSchema, 'contacts');
export default Contact;
