const placar_title = document.getElementById('placar-title');
const placar_content = document.getElementById('placar-content');

async function fetchJogos() {
    const response = await fetch('http://54.233.6.93:3000/jogos');
    const jogos = await response.json();


    jogos.forEach(jogo => {
        const li = document.createElement('li');
        li.id = "placar-list"
        li.innerHTML =
            `<div>
                <p>${jogo.mandante} ${jogo.placar_mandante} X ${jogo.placar_convidado} ${jogo.convidado}</p>
                <button onclick="editProduct(${jogo.id})">Editar</button><button onclick="deleteProduct(${jogo.id})">Remover</button>
            </div>`;

        placar_content.appendChild(li);
    });
};

async function deleteProduct(id) {
    const response = await fetch('http://54.233.6.93:3000/jogos/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        //body: JSON.stringify({id})
    });

    window.location.reload();

    return response.json();
}

async function editProduct(id) {
    const response = await fetch('http://54.233.6.93:3000/jogos/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        //body: JSON.stringify({id})
    });

    window.location.reload();

    return response.json();
}