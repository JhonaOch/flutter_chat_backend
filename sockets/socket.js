const { usuarioConectado, usuarioDesconectado ,grabarMensaje} = require('../controllers/socket_status_user');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    //Como saber que el cliente tenga JWT

    // console.log(client.handshake.headers['x-token']);
     
    const [valido,uid]= comprobarJWT(client.handshake.headers['x-token'])
    
    if(!valido){
       return client.disconnect();
    }

    // console.log('Usuario autenticado');

    usuarioConectado(uid);

    //Ingresar al usuario a una sala particular
    // Ingresar a una sala global ,client.id

    client.join(uid);

    //Escuchar mensajes del cliente

    client.on('mensaje-personal',async (payload) => {

        //TODO Grabar mensaje en la base de datos


       


      // console.log('Mensaje recibido', payload);

       await grabarMensaje(payload);


        //Enviar mensaje a un usuario particular
        io.to(payload.para).emit('mensaje-personal', payload);

    });

    //client.to(uid).emit('');

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });


});
