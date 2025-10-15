import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: String, required: true },
    refreshTokenValidUntil: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SessionCollection = mongoose.model('Sessions', sessionSchema, 'sessions');
export default SessionCollection;
