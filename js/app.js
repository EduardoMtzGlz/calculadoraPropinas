let cliente = {
    mesa: '', 
    hora: '', 
    pedido: []
}

const categorias = {
    1: 'Comida', 
    2: 'Bebidas', 
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente'); 
const seccionResumen = document.querySelector('#resumen');

const contenido = document.querySelector('#platillos .contenido'); 
 

btnGuardarCliente.addEventListener('click', guardarCliente); 


function guardarCliente(){
    const mesa = document.querySelector('#mesa').value; 
    const hora = document.querySelector('#hora').value; 

    

    // const {mesa, hora} = cliente; 

    // if(mesa === '' || hora === ''){
    //     console.log('No hay nada')
    // }

    //Otra forma diferente de validar sí hay campos vacios

    const camposVacios = [mesa, hora].some( campo => campo === ''); 

    if (camposVacios) {
        mostrarAlerta('Hay campos vacios'); 
        return; 
    }; 

    //Asignando datos del formulario 
    cliente = {...cliente, mesa, hora } 
    
    
    //Ocultar modal 

    const modalFormulario = document.querySelector('#formulario'); 
    const modalBootStrap = bootstrap.Modal.getInstance(modalFormulario); 
    modalBootStrap.hide(); 

    //Mostrar las secciones al crear nueva orden 
    mostrarSecciones(); 

    //Obtener platillos de la API

    consultarPlatillos()



}

function consultarPlatillos(){

    const url = 'http://localhost:4000/platillos'; 

    

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado)); 

}

function mostrarPlatillos(platillos){
    

    const contenido = document.querySelector('#platillos .contenido'); 
    
    

    platillos.forEach(platillo => {
        
        const {id, nombre, precio, categoria} = platillo;

        const row = document.createElement('DIV'); 
        row.classList.add('row', 'py-3', 'border-top'); 

        const nombreDIV = document.createElement('div'); 
        nombreDIV.classList.add('col-md-4'); 
        nombreDIV.textContent = nombre; 

        const precioDIV = document.createElement('DIV'); 
        precioDIV.classList.add('col-md-3', 'fw-bold'); 
        precioDIV.textContent = `$ ${precio}`; 

        const categoriaDIV = document.createElement('DIV'); 
        categoriaDIV.classList.add('col-md-3'); 
        categoriaDIV.textContent = categorias[categoria]; 

        const inputCantidad = document.createElement('INPUT'); 
        inputCantidad.classList.add('form-control');
        inputCantidad.type = 'number';
        inputCantidad.min = 0; 
        inputCantidad.value = 0; 
        inputCantidad.id = `producto-${id}`; 
        
        //Función que detecta la cantidad y el platillo que se esta agregando

        inputCantidad.onchange = function (){
            const cantidad = Number(inputCantidad.value);            
            
            agregandoPlatillo({...platillo, cantidad})
        }

        const agregar = document.createElement('DIV'); 
        agregar.classList.add('col-md-2'); 
        agregar.appendChild(inputCantidad); 

        
        row.appendChild(nombreDIV); 
        row.appendChild(precioDIV); 
        row.appendChild(categoriaDIV); 
        row.appendChild(agregar); 
        

        contenido.appendChild(row);        

    });
}

function agregandoPlatillo(producto){
    
    let {pedido} = cliente

    //Revisa que la cantidad sea mayor a 0

    if(producto.cantidad > 0){

        //Comprueba si el elemento ya existe en el array 
        if(pedido.some( articulo => articulo.id === producto.id)){
            //El artículo ya existe, se actualiza la cantidad 
            const pedidoActualizado = pedido.map( articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad; 
                }
                return articulo; 
            }); 

            //Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado]; 

        }else{
            //El artículo no existe, se agrega al array de pedido
            cliente.pedido = [...pedido, producto]
        }
        
    }else{
        //Eliminar elementos cuando la cantidad es 0

        const resultado = pedido.filter(articulo => articulo.id !== producto.id); 

        cliente.pedido = [...resultado]; 
    }

    //Limpiar el código html previo
    limpiarHTML('#resumen .contenido');

    if(cliente.pedido.length ){
        //Mostrar el resumen     
        actualizarResumen();
    }else{
        //Mensaje de pedido cuando no hay nada
        mensajePedidoVacio(); 
    }

    
    
}

function actualizarResumen(){
    
    
    
    const contenido = document.querySelector('#resumen .contenido');
    
    const heading = document.createElement('H3'); 
    heading.textContent = 'Platillos Consumidos'; 
    heading.classList.add('my-4', 'text-center')

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('P'); 
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold'); 

    const mesaSpan = document.createElement('SPAN'); 
    mesaSpan.textContent = cliente.mesa; 
    mesaSpan.classList.add('fw-normal'); 

    //Informacion de la hora
    const hora = document.createElement('P'); 
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold'); 

    const horaSpan = document.createElement('SPAN'); 
    horaSpan.textContent = cliente.hora; 
    horaSpan.classList.add('fw-normal'); 

    //Iterar sobre el array de pedidos 

    const grupo = document.createElement('UL');
    grupo.classList.add('list-group')

    const {pedido} = cliente; 

    pedido.forEach(articulo =>{
        const {id, nombre, precio, cantidad} = articulo; 

        const lista= document.createElement('LI'); 
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4'); 
        nombreEl.classList.add('my-4')
        nombreEl.textContent = nombre;

        //Cantidad del artículo
        const cantidadEl = document.createElement('P'); 
        cantidadEl.classList.add('fw-bold'); 
        cantidadEl.textContent = 'Cantidad: ';
        
        const cantidadValor = document.createElement('SPAN'); 
        cantidadValor.classList.add('fw-normal'); 
        cantidadValor.textContent = cantidad; 

        //Precio del artículo 

        const precioEl = document.createElement('P'); 
        precioEl.classList.add('fw-bold'); 
        precioEl.textContent = 'Precio: $ ';
        
        const precioValor = document.createElement('SPAN'); 
        precioValor.classList.add('fw-normal'); 
        precioValor.textContent = precio; 

        //Subtotal 

        const subtotalCantidad = cantidad * precio;

        const subtotalEl = document.createElement('P'); 
        subtotalEl.classList.add('fw-bold'); 
        subtotalEl.textContent = 'Subtotal: $ ';
        
        const subtotalValor = document.createElement('SPAN'); 
        subtotalValor.classList.add('fw-normal'); 
        subtotalValor.textContent = subtotalCantidad; 

        //Boton para eliminar el pedido directamente 

        const elminarBTN = document.createElement('BUTTON');
        elminarBTN.classList.add('btn', 'btn-danger'); 
        elminarBTN.textContent = 'Eliminar'; 

        elminarBTN.onclick = function (){
            eliminarProducto(id) 
        }

        //Agregar valores a sus contenedores 

        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor); 

        

        //Agregar elementos al li

        lista.appendChild(nombreEl); 
        lista.appendChild(cantidadEl); 
        lista.appendChild(precioEl); 
        lista.appendChild(subtotalEl);
        lista.appendChild(elminarBTN); 

        grupo.appendChild(lista); 

        
    })

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan); 
    hora.appendChild(horaSpan);

    //Agregar al elemento padre
    resumen.appendChild(heading); 
    resumen.appendChild(mesa); 
    resumen.appendChild(hora);
    
    resumen.appendChild(grupo); 

    contenido.appendChild(resumen); 
    

    //Mostrar formulario de propinas

    formularioPropinas();


}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none'); 

    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none')); 

}

function mostrarAlerta(mensaje){
    
    const modalBody = document.querySelector('.modal-body')
    const alertaDIV = document.createElement('DIV');
    const existeAlerta = document.querySelector('.invalid-feedback'); 


    if(!existeAlerta){
        alertaDIV.classList.add('invalid-feedback', 'd-block', 'text-center'); 
        alertaDIV.textContent = mensaje; 

        modalBody.appendChild(alertaDIV);

        setTimeout(() => {
            
            alertaDIV.remove(); 
        }, 2000);
    }   
   
}

function limpiarHTML(referencia){
    const contenido = document.querySelector(referencia);
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild); 
    }
}

function eliminarProducto(id){
    const {pedido} = cliente; 
    
    const resultado = pedido.filter(articulo => articulo.id !== id); 

    cliente.pedido = [...resultado]; 

    //Limpiar el código html previo
    limpiarHTML('#resumen .contenido');

    
    
    //Mensaje de pedido cuando no hay nada
    if(cliente.pedido.length){
        //Mostrar el resumen         
        actualizarResumen(); 
    }else{
        mensajePedidoVacio();
    }

    //El producto se eliminó, regresar a 0 el formulario

    const productoEliminado = `#producto-${id}`; 
    const inputEliminado = document.querySelector(productoEliminado); 
    inputEliminado.value = 0; 
    

}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido'); 

    const formulario = document.createElement('DIV'); 
    formulario.classList.add('formulario', 'col-md-6');

    const resumen = document.createElement('DIV');
    resumen.classList.add('card', 'py-2', 'px-3', 'shadow', 'text-center');

    const heading = document.createElement('H3'); 
    heading.classList.add('my-4'); 
    heading.textContent = 'Propina'; 

    
    
    
    //Radio button 0%

    const radio0 = document.createElement('INPUT'); 
    radio0.type= 'radio'; 
    radio0.name = 'propina'; 
    radio0.value = 0; 
    radio0.classList.add('form-check-input'); 
    
    const radio0Label = document.createElement('LABEL'); 
    radio0Label.textContent = '0%'; 
    radio0Label.classList.add('form-check-label'); 
    
    const radio0Div = document.createElement('DIV'); 
    radio0Div.classList.add('form-check'); 
    
    radio0Div.appendChild(radio0); 
    radio0Div.appendChild(radio0Label); 

    
    
    radio0.onclick = function(){
        calcularPropina(); 
 
    }

    //Radio button 10%

    const radio10 = document.createElement('INPUT'); 
    radio10.type= 'radio'; 
    radio10.name = 'propina'; 
    radio10.value = 10; 
    radio10.classList.add('form-check-input'); 

    const radio10Label = document.createElement('LABEL'); 
    radio10Label.textContent = '10%'; 
    radio10Label.classList.add('form-check-label'); 

    const radio10Div = document.createElement('DIV'); 
    radio10Div.classList.add('form-check'); 

    radio10Div.appendChild(radio10); 
    radio10Div.appendChild(radio10Label); 

    radio10.onclick = function(){
       calcularPropina(); 

        
    }

    

    //Radio button 15%

    const radio15 = document.createElement('INPUT'); 
    radio15.type= 'radio'; 
    radio15.name = 'propina'; 
    radio15.value = 15; 
    radio15.classList.add('form-check-input'); 
    
    const radio15Label = document.createElement('LABEL'); 
    radio15Label.textContent = '15%'; 
    radio15Label.classList.add('form-check-label'); 
    
    const radio15Div = document.createElement('DIV'); 
    radio15Div.classList.add('form-check'); 
    
    radio15Div.appendChild(radio15); 
    radio15Div.appendChild(radio15Label); 

    radio15.onclick = function(){
        calcularPropina();         
    }


    //Radio button 20%

    const radio20 = document.createElement('INPUT'); 
    radio20.type= 'radio'; 
    radio20.name = 'propina'; 
    radio20.value = 20; 
    radio20.classList.add('form-check-input'); 
    radio20.onclick = function(){
        calcularPropina();         
    }

    
    const radio20Label = document.createElement('LABEL'); 
    radio20Label.textContent = '20%'; 
    radio20Label.classList.add('form-check-label'); 
    
    const radio20Div = document.createElement('DIV'); 
    radio20Div.classList.add('form-check'); 
    
    radio20Div.appendChild(radio20); 
    radio20Div.appendChild(radio20Label); 

    //Radio button 30%

    const radio30 = document.createElement('INPUT'); 
    radio30.type= 'radio'; 
    radio30.name = 'propina'; 
    radio30.value = 30; 
    radio30.classList.add('form-check-input'); 
    
    const radio30Label = document.createElement('LABEL'); 
    radio30Label.textContent = '30%'; 
    radio30Label.classList.add('form-check-label'); 
    
    const radio30Div = document.createElement('DIV'); 
    radio30Div.classList.add('form-check'); 
    
    radio30Div.appendChild(radio30); 
    radio30Div.appendChild(radio30Label); 
    radio30.onclick = function(){
        calcularPropina();         
    }

    
    //Radio button 40%

    const radio40 = document.createElement('INPUT'); 
    radio40.type= 'radio'; 
    radio40.name = 'propina'; 
    radio40.value = 40; 
    radio40.classList.add('form-check-input'); 
    
    const radio40Label = document.createElement('LABEL'); 
    radio40Label.textContent = '40%'; 
    radio40Label.classList.add('form-check-label'); 
    
    const radio40Div = document.createElement('DIV'); 
    radio40Div.classList.add('form-check'); 
    
    radio40Div.appendChild(radio40); 
    radio40Div.appendChild(radio40Label); 
    radio40.onclick = function(){
        calcularPropina();         
    }

    

    //Agregar al div principal 
    resumen.appendChild(heading);
    resumen.appendChild(radio0Div);
    resumen.appendChild(radio10Div);
    resumen.appendChild(radio15Div);
    resumen.appendChild(radio20Div);
    resumen.appendChild(radio30Div);
    resumen.appendChild(radio40Div);
    

    formulario.appendChild(resumen);  
    contenido.appendChild(formulario);  



    
    
    

}

function calcularPropina(valor){
    //Extraemo el pedido del cliente
    const {pedido} = cliente; 

    let subtotal = 0; 
    let total= 0;
    
    //Calcular el subtotal
    pedido.forEach(individual =>{
        const {precio, cantidad} = individual; 
        
        subtotal += precio * cantidad;
    })

    //Seleccionar el radio botton
    const propinaSeleccionada = document.querySelector('[name ="propina"]:checked').value;

    //Calculando el valor de la propina
    let valorPropina = propinaSeleccionada * subtotal / 100

    //Calculando el valor total a pagar
    total = Number(valorPropina + subtotal); 

    
    
    mostrarTotalHTML(subtotal, total, propinaSeleccionada); 
        
}

function mostrarTotalHTML(subtotal,total, propina){
    
    const divTotales = document.createElement('DIV'); 
    divTotales.classList.add('total-pagar', 'my-5');  
    
    //Párrafo del subtotal
    const subtotalParrafo = document.createElement('P'); 
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2'); 
    subtotalParrafo.textContent = 'Subtotal Consumido: '; 

    const subtotalSpan = document.createElement('SPAN'); 
    subtotalSpan.classList.add('fw-normal'); 
    subtotalSpan.textContent = `$ ${subtotal}`

    //Párrafo de la propina
    const propinaParrafo = document.createElement('P'); 
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-2'); 
    propinaParrafo.textContent = 'Propina Seleccionada: '; 

    const propinaSpan = document.createElement('SPAN'); 
    propinaSpan.classList.add('fw-normal'); 
    propinaSpan.textContent = `${propina} %`

    //Párrafor del total 

    const totalParrafo = document.createElement('P'); 
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2'); 
    totalParrafo.textContent = 'Total a pagar: '; 

    const totalSpan = document.createElement('SPAN'); 
    totalSpan.classList.add('fw-normal'); 
    totalSpan.textContent = `$ ${total}`


    


    subtotalParrafo.appendChild(subtotalSpan); 
    propinaParrafo.appendChild(propinaSpan); 
    totalParrafo.appendChild(totalSpan); 

    const totalAPagarDIVLimpiar = document.querySelector('.total-pagar'); 

    if(totalAPagarDIVLimpiar){
        totalAPagarDIVLimpiar.remove()
    }

    divTotales.appendChild(subtotalParrafo); 
    divTotales.appendChild(propinaParrafo); 
    divTotales.appendChild(totalParrafo); 

    const formulario = document.querySelector('.formulario > div');   
    formulario.appendChild(divTotales); 

    

    
}




function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document. createElement('P'); 
    texto.classList.add('text-center'); 
    texto.textContent = 'Añade los elementos del pedido'; 

    contenido.appendChild(texto); 
}

function limpiarHTML2(referencia){
    while(referencia.firstChild){
        referencia.removeChild(referencia.firstChild)
    }
}