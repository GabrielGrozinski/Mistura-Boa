import mongoose, {Schema} from "mongoose";

const userSchemma = mongoose.Schema({
    email: {unique: true, type: String},
    diasLogados: {type: Number, default: 1},
    ultimoLogin: {type: Schema.Types.Mixed},
    criadoEm: {type: Schema.Types.Mixed},
}, {
    collection: 'usuarios'
});

const Usuario = mongoose.model('Usuario', userSchemma);

export default Usuario;
