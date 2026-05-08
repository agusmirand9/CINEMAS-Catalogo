const catalogo = document.querySelector('#catalogo');
const loader = document.querySelector('#loader');
const buscador = document.querySelector('#buscador');

let todasPelis=[];

window.addEventListener('load', function() {
    cargarPelis();

    catalogo.addEventListener('click', function(event){
        const elemento = event.target;

        const btnVerMas = elemento.closest('.btn-ver-mas');

        if (btnVerMas) {
            const id = btnVerMas.dataset.id;
            const card = document.querySelector(`#card-${id}`);
            const descripciones = card.querySelectorAll('.card-descripcion');

            descripciones.forEach(function(desc) {
                desc.classList.toggle('visible');
            });

            btnVerMas.querySelector('i').classList.toggle('fa-circle-info');
            btnVerMas.querySelector('i').classList.toggle('fa-circle-xmark');
        }

        const btnFavorito = elemento.closest('.btn-favorito');
        if (btnFavorito) {
            const id = Number(btnFavorito.dataset.id);
            const favs = JSON.parse(localStorage.getItem('Favoritos')) || [];

            if (favs.includes(id)) {
                const index = favs.indexOf(id);
                favs.splice(index, 1);
                btnFavorito.classList.remove('activo');
            } else {
                favs.push(id);
                btnFavorito.classList.add('activo');
            }

            localStorage.setItem('Favoritos', JSON.stringify(favs));
        }

        const btnEliminar = elemento.closest('.btn-eliminar');
        if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            const card = document.querySelector(`#card-${id}`);
            card.parentElement.remove();

            todasPelis = todasPelis.filter(function(peli) {
                return peli.id !== Number(id);
            });
        }

    });

        buscador.addEventListener('input', function(){
        const texto = buscador.value.toLowerCase();

        const filtradas = todasPelis.filter(function(peli){
            return peli.nombre.toLowerCase().includes(texto) ||
                   peli.categoria.toLowerCase().includes(texto) ||
                   peli.tipo.toLowerCase().includes(texto);
        });

        if (filtradas.length === 0) {
            catalogo.innerHTML = `
                <div class="col-12 text-center mt-5">
                    <p style="color: var(--gris-texto); font-size: 1.1rem;">
                        No se encontraron resultados para "<strong>${buscador.value}</strong>"
                    </p>
                </div>
            `;
        } else {
            renderizarPelis(filtradas);
        }
    });

});


function cargarPelis(){
    loader.style.display='block';

    fetch('data.json')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            todasPelis = data;
            loader.style.display='none';
            renderizarPelis(todasPelis);
        })

        .catch(function(error){
            loader.style.display='none';
            console.error('Error al cargar las películas:', error);
                catalogo.innerHTML = 
                ` <div class="text-center mt-4">
                    <p>No se pudieron cargar las películas. Intentá de nuevo más tarde.</p>
                </div>
                `;
        })

}


function renderizarPelis(pelis){
    catalogo.innerHTML = '';
    const favs = JSON.parse(localStorage.getItem('Favoritos')) || [];
    let html = '';

    pelis.forEach(function(peli){

        const esFavorito = favs.includes(Number(peli.id));

            html +=
            `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card" id="card-${peli.id}">
                    <img src="${peli.imagen}" alt="${peli.nombre}">

                    <div class="card-body">
                        <span class="card-categoria">${peli.categoria}</span>
                        <p class="card-tipo"> ${peli.tipo} ${peli.año}</p>
                        <h3 class="card-title">${peli.nombre}</h3>
                        <p class="card-descripcion">${peli.descripcion}</p>
                        <p class="card-descripcion"><strong>Actores:</strong> ${peli.actores.join(', ')}</p>
                    </div>

                    <div class="card-footer-btns">
                        <button class="btn-ver-mas" data-id="${peli.id}"><i class="fa-solid fa-circle-info"></i></button>
                        <button class="btn-favorito ${esFavorito ? 'activo' : ''}" data-id="${peli.id}"><i class="fa-solid fa-star"></i></button>
                        <button class="btn-eliminar" data-id="${peli.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>`;



    });

      catalogo.innerHTML = html;

}

