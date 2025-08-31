import mongoose from 'mongoose';

export default function conectaDB() {
    async function conexaoTeste() {
        try {
            const uri = 'mongodb+srv://gabrielgrozinski_MisturaBoa:ZW1Xws1NxqASgt8W@misturaboa.p4vhv3k.mongodb.net/?retryWrites=true&w=majority&appName=MisturaBoa';
            await mongoose.connect(uri);
            console.log('Conectado ao MongoDB Atlas!');
        } catch (erro) {
            console.log('Erro na conexão', erro);
        }
    };
    conexaoTeste();
};
