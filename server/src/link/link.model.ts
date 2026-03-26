import mongoose from "mongoose";

interface Link {
  slug: string;
  displayTitle: string;
  mappedUrl?: string | null;
  mappingKeyHash: string | null;
  mappedOn?: Date | null;
}

interface LinkVirtual {
  status: "ready" | "pending";
}

const LinkSchema = new mongoose.Schema<
  Link,
  mongoose.Model<Link>,
  {},
  LinkVirtual
>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    displayTitle: { type: String, default: "deadline" },
    // Filled when owner maps the real target.
    mappedUrl: { type: String, default: null },
    mappingKeyHash: { type: String, default: null },
    mappedOn: { type: Date, default: null },
  },
  { timestamps: true },
);

LinkSchema.virtual("status").get(function () {
  return this.mappedUrl ? "ready" : "pending";
});

export default mongoose.model("Link", LinkSchema);
