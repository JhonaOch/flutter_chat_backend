const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

   return new Promise((resolve, reject) => {
    const payload = {
        uid
    };

     jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_TIME_EXPIRATION


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

const comprobarJWT = (token='') => {

    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        return [true,uid];
    } catch (error) {
        return [false,null];
    }


}


module.exports = {
    generarJWT,
    comprobarJWT

}