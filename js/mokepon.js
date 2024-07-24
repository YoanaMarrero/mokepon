//const mainpath = 'http://localhost:8080/mokepon';
const mainpath = 'http://localhost/mokepon';

const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota');
const botonReiniciar = document.getElementById('boton-reiniciar');
sectionReiniciar.style.display = 'none'

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const spanMascotaJugador =  document.getElementById('mascota-jugador')

const spanMascotaEnemigo =  document.getElementById('mascota-enemigo')

const spanVidasJugador = document.getElementById("vidas-jugador");    
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa');
const mapa = document.getElementById('mapa');

let jugadorId = null
let mokepones = []
let mokeponesEnemigos = []
//let ataqueJugador 
//let ataqueEnemigo
let opcionDeMokepones

let inputHipodoge
let inputCapipepo
let inputRatigueya

let mascotaJugadorObjeto
let mascotaJugador
let ataquesMokepon
let ataquesMokeponEnemigo = []

let botonFuego 
let botonAgua
let botonTierra


let botones = []
let ataquesJugador = []
let ataquesEnemigo = []
let indexAtaqueEnemigo 
let indexAtaqueJugador

let victoriasJugador = 0
let victoriasEnemigo = 0

let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d");
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './images/mokemap.png'

let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800
mapa.width = anchoDelMapa 
mapa.height = alturaQueBuscamos

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null){
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida   
        this.ataques = []            
        this.alto  = 40
        this.ancho = 40 
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadx = 0
        this.velocidady = 0
    } 

    pintarMokepon(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let hipodoge = new Mokepon ('Hipodoge', './images/hipodoge.png', 5, './images/hipodoge.png');
let capipepo = new Mokepon ('Capipepo', './images/capipepo.png', 5, './images/capipepo.png');
let ratigueya = new Mokepon ('Ratigueya', './images/ratigueya.png', 5, './images/ratigueya.png');

let hipodogeEnemigo = new Mokepon ('Hipodoge', './images/hipodoge.png', 5, './images/hipodoge.png');
let capipepoEnemigo = new Mokepon ('Capipepo', './images/capipepo.png', 5, './images/capipepo.png');
let ratigueyaEnemigo = new Mokepon ('Ratigueya', './images/ratigueya.png', 5, './images/ratigueya.png');

const HIPODEGE_ATAQUES = [
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🌱', id: 'boton-tierra' }
]

const CAPIPEPO_ATAQUES = [
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🔥', id: 'boton-fuego' }
]

const RATIGUEYA_ATAQUES = [    
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🌱', id: 'boton-tierra' }
]
hipodoge.ataques.push(...HIPODEGE_ATAQUES)
capipepo.ataques.push(...CAPIPEPO_ATAQUES)
ratigueya.ataques.push(...RATIGUEYA_ATAQUES)
mokepones.push(hipodoge,capipepo, ratigueya);

function iniciarJuego() {    

    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'
    
    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
            <input type="radio" name="mascota" id=${mokepon.nombre} /> 
            <label class="tarjeta-de-mokepon" id="label-${mokepon.nombre}" for="${mokepon.nombre}" >
                <img src="${mokepon.foto}" alt="${mokepon.nombre}" /> 
                ${mokepon.nombre}
            </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones

    })
    
    inputHipodoge = document.getElementById('Hipodoge')
    inputCapipepo = document.getElementById('Capipepo')
    inputRatigueya =  document.getElementById('Ratigueya')

    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador )   
    botonReiniciar.addEventListener('click', reiniciarJuego)
    botonReiniciar.style.display = 'none'

    unirseAlJuego()
}

function unirseAlJuego() {
    //let url = "http://localhost:8080/unirse";
    let url = mainpath +'/unirse';
    fetch(url)
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function(respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta;
                    })
            }
        })
}
function resaltarMascotaJugador() {   

    let labelHipodoge = document.getElementById('label-hipodoge')
    let labelCapipepo = document.getElementById('label-capipepo')
    let labelRatigueya =  document.getElementById('label-ratigueya')

    if (inputHipodoge.checked) {
        labelHipodoge.style.border = '1px solid #933513';
    
    } else if (inputCapipepo.checked) {
        labelCapipepo.style.border = '1px solid #933513';

    } else if (inputRatigueya.checked) {
        labelRatigueya.style.border = '1px solid #933513';
    }
}

function seleccionarMascotaJugador() {


    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id    
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML =inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert('Seleccionar una mascota')
        return false
    }

    seleccionarMokepon(mascotaJugador);

    extraerAtaques(mascotaJugador)
    //seleccionarMascotaEnemigo()
	sectionVerMapa.style.display = 'flex'
	iniciarMapa();
}

function seleccionarMokepon(mascotaJugador){
    
    //let url = "http://localhost:8080/mokepon/";
    let url = mainpath +`/${jugadorId}`;
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques 

    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador == mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
    }

    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque)=> {
        ataquesMokepon = `        
            <button class="boton-de-ataque bAtaques" id="${ataque.id}">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })

    
    botonFuego = document.getElementById("boton-fuego")
    botonAgua = document.getElementById("boton-agua")
    botonTierra = document.getElementById("boton-tierra")
    
    /*
    botonFuego.addEventListener('click', ataqueFuego)
    botonAgua.addEventListener('click', ataqueAgua)
    botonTierra.addEventListener('click', ataqueTierra)
    */

    botones = document.querySelectorAll('.bAtaques');
}

function secuenciaAtaque() {
    /* 💧 🔥 🌱 */
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            switch (e.target.textContent){
            case '🔥':
                ataquesJugador.push('FUEGO');
                break;
            case '💧':
                ataquesJugador.push('AGUA');
                break;
            case '🌱':
                ataquesJugador.push('TIERRA');
                break;
            }
            boton.style.background = '#d3d0cf'
            boton.disabled = true;
           // console.log(ataquesJugador);
            ataqueAleatorioEnemigo();
        })
    })
}

function seleccionarMascotaEnemigo(enemigo) {
   // let mascotaAleatorio = aleatorio(0, mokepones.length-1)
    //spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatorio].nombre
    //ataquesMokeponEnemigo = mokepones[mascotaAleatorio].ataques

    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaAtaque()
    
    sectionSeleccionarMascota.style.display = 'none'
    //sectionVerMapa.style.display = 'flex'
    //iniciarMapa()
    //sectionSeleccionarAtaque.style.display = 'flex'
}

function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length -1)
    
    if (ataqueAleatorio == 1) {
        ataquesEnemigo.push('FUEGO')
    } else if (ataqueAleatorio == 2) {
        ataquesEnemigo.push('AGUA')
    } else {
        ataquesEnemigo.push('TIERRA')
    } 
    
    //console.log(ataquesEnemigo);
    iniciarPelea()
}

function iniciarPelea() {
    if (ataquesJugador.length === 5)
        combate()
}

function indexAmbosOponente(jugador, enemigo) {
    indexAtaqueJugador =  ataquesJugador[jugador]
    indexAtaqueEnemigo = ataquesEnemigo[enemigo]
}

function combate(jugador, pc) { 

    for (let index = 0; index < ataquesJugador.length; index++) {
        if (ataquesEnemigo[index] == ataquesJugador[index]){
            indexAmbosOponente(index, index);
            crearMensaje("EMPATE")

        } else if ((ataquesJugador[index] == 'FUEGO' && ataquesEnemigo[index] == 'TIERRA') 
            || (ataquesJugador[index] == 'AGUA' && ataquesEnemigo[index] == 'FUEGO') 
            || (ataquesJugador[index] == 'TIERRA' && ataquesEnemigo[index] == 'AGUA')) {
                
            indexAmbosOponente(index, index);
            crearMensaje("GANASTE")
            victoriasJugador++            
            spanVidasJugador.innerHTML = victoriasJugador
            
        } else {
            indexAmbosOponente(index, index);
            crearMensaje("PERDISTE")
            victoriasEnemigo++            
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
        
    }

    // Revisar las vidas
    revisarVidas()
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("EMPATE") 
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("GANAMOS ☺")
    } else {
        crearMensajeFinal("PERDIMOS 😭")
    }
}

function crearMensaje(resultado) {
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)

}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal

    botonFuego.disabled = true
    botonAgua.disabled = true
    botonTierra.disabled = true

    botonReiniciar.style.display = 'block'
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {

    mascotaJugadorObjeto.x += mascotaJugadorObjeto.velocidadx
    mascotaJugadorObjeto.y += mascotaJugadorObjeto.velocidady

    lienzo.clearRect(0,0,mapa.width, mapa.height);
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width, 
        mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon();
    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)
    
    mokeponesEnemigos.forEach(function(mokepon) {
        mokepon.pintarMokepon();
        revisarColision(mokepon);
    })
}

function enviarPosicion(x, y) {
    
    //let url = "http://localhost:8080/mokepon/";
    let url = mainpath +`/${jugadorId}/posicion`;
    fetch(url, {
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res){
        if (res.ok) {
            res.json()
                .then(function({enemigos}) {

                    mokeponesEnemigos = enemigos.map(function(enemigo) {

                        const mokeponNombre = enemigo.mokepon.nombre
                        let mokeponEnemigo = null
                        switch(mokeponNombre) {
                            case "Hipodoge":
                                mokeponEnemigo = new Mokepon ('Hipodoge', './images/hipodoge.png', 5, './images/hipodoge.png');
                                break;
                            case "Capipepo":
                                mokeponEnemigo = new Mokepon ('Capipepo', './images/capipepo.png', 5, './images/capipepo.png');
                                break;
                            case "Ratigueya":
                                mokeponEnemigo = new Mokepon ('Ratigueya', './images/ratigueya.png', 5, './images/ratigueya.png');
                                break;
                        }

                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y
                        
                        return mokeponEnemigo;
                        
                    });
                })
        }
    })
}

function moverCapipepo_Derecha() {
    /*
    capipepo.x = capipepo.x + 5
    pintarCanvas();
    */
    mascotaJugadorObjeto.velocidadx = 5
}

function moverCapipepo_Izquierda() {
    mascotaJugadorObjeto.velocidadx = -5
}

function moverCapipepo_Abajo() {
    mascotaJugadorObjeto.velocidady = 5
}

function moverCapipepo_Arriba() {
    mascotaJugadorObjeto.velocidady = -5
}

function detenerMovimiento() {
    /*
    capipepo.velocidadx = 0
    capipepo.velocidady = 0
    */
   mascotaJugadorObjeto.velocidadx = 0
   mascotaJugadorObjeto.velocidady = 0

}

function sePresionoTecla(event) {
    switch(event.key) {
    case 'ArrowUp':
        moverCapipepo_Arriba()
        break;
    case 'ArrowDown':
        moverCapipepo_Abajo()
        break;
    case 'ArrowLeft':
        moverCapipepo_Izquierda()
        break;
    case 'ArrowRight':
        moverCapipepo_Derecha()
        break;
    }
    
    
}

function iniciarMapa() {    
    mapa.width = 320
    mapa.height = 240
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)

    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', sePresionoTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascota () {

    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador == mokepones[i].nombre) {
           return mokepones[i]
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento();
    clearInterval(intervalo);
    sectionSeleccionarAtaque.style.display = 'flex';
    sectionVerMapa.style.display = 'none';
    seleccionarMascotaEnemigo(enemigo);
    
}
window.addEventListener('load', iniciarJuego)
