import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  slug: string;
  displayTitle: string;
  mappedUrl: string | null;
  mappedOn: Date | null;
  ownerId: string; // Clerk userId
  publicUrl: string;
  manageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<ILink>(
  {
    slug: { type: String, required: true, unique: true },
    displayTitle: { type: String, default: "" },
    mappedUrl: { type: String, default: null },
    mappedOn: { type: Date, default: null },
    publicUrl: { type: String },
    manageUrl: { type: String },
    ownerId: { type: String, required: true }, // owner
  },
  { timestamps: true },
);

linkSchema.virtual("status").get(function () {
  return this.mappedUrl ? "ready" : "pending";
});

const linkModel = mongoose.model<ILink>("Link", linkSchema);
export default linkModel;
