import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  slug: string;
  displayTitle: string;
  // mappingKeyHash: string;
  mappedUrl?: string;
  mappedOn?: Date;
  ownerId: string; // Clerk userId
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<ILink>(
  {
    slug: { type: String, required: true, unique: true },
    displayTitle: { type: String, default: "" },
    // mappingKeyHash: { type: String, required: true },
    mappedUrl: { type: String },
    mappedOn: { type: Date },
    ownerId: { type: String, required: true }, // owner
  },
  { timestamps: true },
);

linkSchema.virtual("status").get(function () {
  return this.mappedUrl ? "ready" : "pending";
});

const linkModel = mongoose.model<ILink>("Link", linkSchema);
export default linkModel;
