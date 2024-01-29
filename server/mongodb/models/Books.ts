import mongoose from "mongoose";

interface IBook {
    author: string;
    name: string;
    pages: number;
}

const bookSchema = new mongoose.Schema<IBook>({
    author: { type: String, required: true },
    name: { type: String, required: true },
    pages: { type: Number, required: true }
});

export const Book = mongoose.model<IBook>('Book', bookSchema);
