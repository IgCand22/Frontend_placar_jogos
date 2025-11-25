const placar_title = document.getElementById('placar-title');
const placar_content = document.getElementById('placar-content');
const decricao_placar = document.getElementById('descricao');

async function fetchJogos() {
    const response = await fetch('http://54.233.144.247:3000/jogos');
    const jogos = await response.json();

    jogos.forEach(jogo => {
        const li = document.createElement('li');
        li.id = "placar-list"
        li.innerHTML = `<div>
        <p>${jogo.mandante} ${jogo.placar_mandante} X ${jogo.placar_convidado} ${jogo.convidado}</p>
        <button>Editar</button><button>Remover</button>
        </div>`;

        placar_content.appendChild(li);
    });
};

 
fetchJogos();