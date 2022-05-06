const bcrypt = require('bcryptjs/dist/bcrypt');
const { responde } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');


const crearUsuario = async (req, res = responde) => {

    const { email,password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            });
        } 
        const usuario = new Usuario(req.body);

        //Encryptar contrasena
        const salt = await bcrypt.genSalt();
        usuario.password = await bcrypt.hashSync(password, salt);

        await usuario.save();

        //GENERAR MI JWT
        const token= await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }

}


const login = async (req, res = responde) => {
    
       

        const { email, password } = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }


        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const renewToken = async (req, res) => {

    const  uid  = req.uid;

    try{


          //GENERAR MI JWT
          const token= await generarJWT(uid);

          const usuario= await Usuario.findById(uid);



          

        res.json({
            ok: true,
            usuario,
            token
           
           // msg:'El token se renovó correctamente'
        });

    }catch (error) {


    }


}


module.exports = {
    crearUsuario,
    login,
    renewToken
}