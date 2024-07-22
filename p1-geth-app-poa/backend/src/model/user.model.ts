import mongoose from 'mongoose';

export interface IUser {
    id: string;
    username: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
});

userSchema.virtual('id').get(function() {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

export const userModel = mongoose.model('User', userSchema);
