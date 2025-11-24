const placar_title = document.getElementById('placar-title');
const placar_content = document.getElementById('placar-content');

async function fetchJogos() {
    const response = await fetch('http://54.233.7.139:3000/jogos');
    const jogos = await response.json();

    jogos.forEach(jogo => {
        const li = document.createElement('li');
        li.id = "placar-list"
        li.innerHTML = `${jogo.mandante} ${jogo.placar_mandante} X ${jogo.convidado} ${jogo.placar_convidado}`;

        placar_content.appendChild(li);
    });

};

 
fetchJogos();