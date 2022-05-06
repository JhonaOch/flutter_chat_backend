const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

   return new Promise((resolve, reject) => {
    const payload = {
        uid
    };

     jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '24h'


    },(err,token) =>{

        if(err){
            //No se puede generar el token
            reject('No se pudo generar el token');

        }else{
            //TOKEN GENERADO
            resolve(token);

        }

    }
    );

   });



}


module.exports = {
    generarJWT

}