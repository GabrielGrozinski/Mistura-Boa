import mongoose from "mongoose";

const imagemSchema = mongoose.Schema({
    id: Number,
    tipo: String,
    data: Buffer,
    contentType: String
}, {collection: 'imagemReceitas'});

const Imagem = mongoose.model('Imagem', imagemSchema);
 
export default Imagem;
