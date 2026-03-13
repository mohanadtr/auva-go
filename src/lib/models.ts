import mongoose, { Schema, Document, Model } from "mongoose";

/* ─── Link ────────────────────────────────────────────────────────────── */

export type LinkDomain = "go.auva.dev" | "auva.site";

export const AVAILABLE_DOMAINS: LinkDomain[] = ["go.auva.dev", "auva.site"];

export interface ILink extends Document {
    slug: string;
    destination: string;
    domain: LinkDomain;
    userId?: string;
    clicks: number;
    isActive: boolean; // soft-delete toggle
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 64,
        },
        destination: { type: String, required: true, maxlength: 2048 },
        domain: {
            type: String,
            enum: ["go.auva.dev", "auva.site"],
            default: "go.auva.dev",
        },
        userId: { type: String, index: true },
        clicks: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        expiresAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// slug index already created by unique: true above
LinkSchema.index({ userId: 1, createdAt: -1 });
LinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index – MongoDB auto-deletes expired docs

/* ─── Click (lightweight counter doc – optional granularity) ─────────── */

export interface IClick extends Document {
    linkId: mongoose.Types.ObjectId;
    date: string; // "YYYY-MM-DD" for daily aggregation
    count: number;
}

const ClickSchema = new Schema<IClick>(
    {
        linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true },
        date: { type: String, required: true }, // daily bucket
        count: { type: Number, default: 0 },
    },
    { timestamps: false }
);

ClickSchema.index({ linkId: 1, date: 1 }, { unique: true });

/* ─── Export Models ───────────────────────────────────────────────────── */

export const Link: Model<ILink> =
    mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema);

export const Click: Model<IClick> =
    mongoose.models.Click || mongoose.model<IClick>("Click", ClickSchema);
