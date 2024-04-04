//Variable para cambiar los tabs
let pagina = 1;

//Objeto para almacenar datos de la cita
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: [],
}

document.addEventListener('DOMContentLoaded', () => { iniciarApp()})

function iniciarApp(){
    mostrarServicios();

    // Resalta el div actual según el tab que se presiona
    mostrarSeccion();
    //Oculta o muesta una seccion según el tab que se presiona
    cambiarSeccion();

    //Paginacion siguiete y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprobando el boton anterior de en la pág 1 y el boton sig en la pág 3
    comprobarPaginacion();

    //Muestra el resumen de la cita (o msjde error al no pasar la validacion)
    mostrarResumen();

    //Comprobamos los datos del formmulario
    nombreCita();
    fechaCita();
    horaCita();

    //Deshabilitar fechas anteriores en el input de fecha
    deshabilitarFecha();
}

function mostrarSeccion(){
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Resaltar tab actual
    const tab =document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}


function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //Elimina la clase mostrar-seccion de la seccion anterior            
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            //Agrega la clase mostrar-seccion donde dimos click 
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            //Elimina la clase actual de la seccion anterior    
            document.querySelector('.tabs .actual').classList.remove('actual') ;       

            //Agrega la clase actual donde dimos click 
            const tabActual =document.querySelector(`[data-paso="${pagina}"]`);
            tabActual.classList.add('actual');

            comprobarPaginacion();
        })
    })
}



async function mostrarServicios(){ // Utilizamos async await para procesar los datos del servidor (este caso seria desde un archivo local)
    
    try{ //Usamos un try/catch por si llega a dar error la consulta  a la base de datos
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json();  //Al resultado siempre debemos indicarle que tipo es. Puede ser "Json" o tipo "Text".
        // const servicios = db.servicios; //Accedemos de toda la base de datos, a la que dice servicios
        const {servicios} = db;

        //Ahora para generar el HTML hay que iterar sobre el arreglo
        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;
            
            //DOM Scripting

            //Creando el nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = ` $${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Div para el nombre y el precio
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicios', 'no-seleccionado')

            contenedorServicio.dataset.idServicio = id;

            contenedorServicio.appendChild(nombreServicio);
            contenedorServicio.appendChild(precioServicio);
            
            //Agregamos una funcion para poder seleccionar cada servicio
            contenedorServicio.addEventListener('click', (e) => seleccionarServicio(e)
            )


            //Recuperando el div de listado de servicios el HTML
            const listadoServicios = document.querySelector('.listado-servicios');
            listadoServicios.appendChild(contenedorServicio);

        });
    } 
    catch (error){
        console.log(error);
    }

}

function seleccionarServicio(e){

    let elemento;
    if(e.target.tagName == 'P'){
        elemento = e.target.parentElement;
    }
    else{
        elemento = e.target;
    }

    

    if (elemento.classList[1] == 'no-seleccionado'){
        elemento.classList.add('seleccionado');
        elemento.classList.remove('no-seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstChild.textContent, //o elemento.firstElementChild.textContent
            precio: elemento.firstElementChild.nextSibling.textContent, //o elemento.lastChild.textContent
        }

        agregarServicio(servicioObj);
    }
    else{
        elemento.classList.add('no-seleccionado');
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }
}

function agregarServicio(servicioObj){
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj]; //Los tres puntos hacen una copia del elemento

    console.log(cita.servicios)
}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicios => servicios.id !== id); //filter es una funcion par filtrar segun algun parametro o valor. en este caso filtramos que queremos todos los servicios cuyo id sea distinto al indicado
    console.log(cita.servicios)
}

function paginaSiguiente(){
    const siguiente = document.querySelector('#siguiente');
    siguiente.addEventListener('click', () => {
        if (pagina == 3){
            pagina = 1;
        }
        else{
            pagina++;
        }
        document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

        //Agrega la clase mostrar-seccion donde dimos click 
         const seccion = document.querySelector(`#paso-${pagina}`);
        seccion.classList.add('mostrar-seccion');

        //Elimina la clase actual de la seccion anterior    
        document.querySelector('.tabs .actual').classList.remove('actual') ;       

        //Agrega la clase actual donde dimos click 
        const tabActual =document.querySelector(`[data-paso="${pagina}"]`);
        tabActual.classList.add('actual');

        comprobarPaginacion();
    })
}

function paginaAnterior(){
    const anterior = document.querySelector('#anterior');
    anterior.addEventListener('click', () => {
        if (pagina == 1){
            pagina = 3;
        }
        else{
            pagina--;
        }

        document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

        //Agrega la clase mostrar-seccion donde dimos click 
        const seccion = document.querySelector(`#paso-${pagina}`);
        seccion.classList.add('mostrar-seccion');

        //Elimina la clase actual de la seccion anterior    
        document.querySelector('.tabs .actual').classList.remove('actual') ;       

        //Agrega la clase actual donde dimos click 
        const tabActual =document.querySelector(`[data-paso="${pagina}"]`);
        tabActual.classList.add('actual');
        comprobarPaginacion();
    })
}

function comprobarPaginacion(){
    const anterior = document.querySelector('#anterior');
    const siguiente = document.querySelector('#siguiente');

    switch(pagina){
        case 1:
            anterior.classList.add('no-mostrar');
            if(siguiente.classList.contains('no-mostrar')){
                siguiente.classList.remove('no-mostrar')
            }
            break;

        case 2:
            if(anterior.classList.contains('no-mostrar')){
                anterior.classList.remove('no-mostrar')
            }

            if(siguiente.classList.contains('no-mostrar')){
                siguiente.classList.remove('no-mostrar')
            }
            break;

        case 3:
            if(anterior.classList.contains('no-mostrar')){
                anterior.classList.remove('no-mostrar')
            }
            siguiente.classList.add('no-mostrar');
            mostrarResumen()
            break;
    }

}

function mostrarResumen(){
    //Hacemos destructuring del objeto cita
    const {nombre, fecha, hora, servicios} = cita;

    //Recuperams el div donde irá colocado el resumen de la cita
    const contenedor = document.querySelector('.resumen');

    //Limpiamos el html
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }

    //validamos los datos
    if(Object.values(cita).includes('')){

        const parrafoPrevio = document.querySelector('.invalidar-cita');
        
        const parrafo = document.createElement('P');
        parrafo.textContent = 'Necesitas ingresar tu nombre, fecha, hora, y servicios para la cita'
        parrafo.classList.add('invalidar-cita', 'text-center')
    
        contenedor.appendChild(parrafo);
        return;
        
    }

    //Mostrar resumen

    const divServicios = document.createElement('DIV');
    divServicios.classList.add('div-servicios')

    const infoCliente = document.createElement('H3');
    infoCliente.textContent = 'Informacion del Cliente';


    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`

    const infoServicios = document.createElement('H3');
    infoServicios.textContent = 'Informacion de Servicios';


    //Mostramos la informacion de los servicios

    let precioTotal = 0;
    cita.servicios.forEach(servicio =>{
    const {nombre, precio} = servicio;
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicios');

    const nombreServicio = document.createElement('P');
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.textContent = `Precio: ${precio}`;

    contenedorServicio.appendChild(nombreServicio);
    contenedorServicio.appendChild(precioServicio);

    divServicios.appendChild(contenedorServicio);
    const precioParcial = parseInt(precio.split('$')[1]);
    precioTotal += precioParcial
    // console.log(precioParcial);
})

    const precioTot = document.createElement('P');
    precioTot.classList.add('total');
    precioTot.innerHTML = `<span>Total a pagar:</span> $${precioTotal}`;


    contenedor.appendChild(infoCliente);
    contenedor.appendChild(nombreCita);
    contenedor.appendChild(fechaCita);
    contenedor.appendChild(horaCita);

    contenedor.appendChild(infoServicios);
    contenedor.appendChild(divServicios);
    contenedor.appendChild(precioTot);


    // console.log('Llenaste todos los campos')
    
}


function nombreCita(){
    const nombre = document.querySelector('#nombre');
    nombre.addEventListener('input', e => {
        nombreTexto= e.target.value.trim();
        if(nombreTexto === '' || nombreTexto.length < 3){
            cita.nombre = '';
            mostrarAlerta('Nombre no valido', 'error')
        }
        else{
            //Si existe alguna alerta cuando el nombre ya sea valido, entonces se elimina
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }

            //Almacenamos el valor del nombre en el objeto
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo){
    //Si ya hay una alerta, entonces no se crea ninguna otra
    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error'){
        
        alerta.classList.add('error');
    }

    //Insertamos la alerta en el html
    const formulario = document.querySelector('.informacion-cliente')
    formulario.appendChild(alerta);

    //Eliminar la alerta despues de 3 segundos
    setTimeout(()=>{alerta.remove()}, 3000);
}

function fechaCita(){
    const fecha = document.querySelector('#fecha');
    fecha.addEventListener('input', e => {
        valorFecha= new Date(e.target.value);
        const fechaActual = new Date();
        // console.log(fechaActual)
        
        if ( [0, 1].includes(valorFecha.getUTCDay())) {
            e.preventDefault();
            fecha.value = '';
            mostrarAlerta('Domingo y Lunes el local permanece cerrado. Seleccine otra fecha', 'error');
            cita.fecha = '';
        }
        else{
            //Si existe alguna alerta cuando el nombre ya sea valido, entonces se elimina
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }

            cita.fecha = e.target.value;
            console.log(cita);
        }
    })
}

function horaCita(){
    const horaInput = document.querySelector('#hora');
    horaInput.addEventListener('input', e => {
        const valorHora = e.target.value;
        const hora = valorHora.split(':');

        if(hora[0]<10 || hora[0]>19){
            mostrarAlerta('Nuestro horario de trabajo es e 10hs a 20hs. Tomamos turnos hasta las 19hs', 'error');
            cita.hora='';
         // console.log(cita.hora);
        }
        else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }

            cita.hora = valorHora;
            console.log(cita);
        }
    })
}

function deshabilitarFecha(){
    const fechaCita = document.querySelector('#fecha');
    const fechaActual = new Date();

    const anio = fechaActual.getFullYear();
    let mes = fechaActual.getMonth()+1;
    let dia = fechaActual.getDate()+1;

    if (mes < 10){
        mes = `0${fechaActual.getMonth()+1}`
    }
    if (dia <10){
        dia = `0${fechaActual.getDate()+1}`
    }

    fechaDeshabilitar = `${anio}-${mes}-${dia}`;

    fechaCita.min = fechaDeshabilitar;

    console.log(fechaDeshabilitar);
}