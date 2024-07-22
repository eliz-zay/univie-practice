import mongoose from 'mongoose';

export interface IDocument {
    id: string;
    title: string;
    binaryContent: Buffer;
    createdAt: Date;
    contractAddress?: string;
}

const documentSchema = new mongoose.Schema<IDocument>({
    title: { type: String, required: true },
    binaryContent: { type: Buffer, required: true },
    createdAt: { type: Date, required: true },
    contractAddress: { type: String, required: false },
});

documentSchema.virtual('id').get(function() {
    return this._id;
});

documentSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

export const documentModel = mongoose.model('Document', documentSchema);
