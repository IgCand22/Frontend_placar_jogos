const ip_public = '54.94.102.200';
const placar_title = document.getElementById('placar-title');
const placar_content = document.getElementById('placar-content1');
const placar_content1 = document.getElementById('placar-content2');
const btn_procurar = document.getElementById('procurar-btn');
const criar_jogo = document.getElementById('criar-jogo');

criar_jogo.addEventListener('click', criarForm);
btn_procurar.addEventListener('click', procurarJogo);

async function fetchJogos() {
    const response = await fetch(`http://${ip_public}:3000/jogos`);
    const jogos = await response.json();

    placar_content.innerHTML = ' '

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
    const response = await fetch(`http://${ip_public}:3000/jogos/` + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        //body: JSON.stringify({id})
    });

    fetchJogos();
}

// async function editProduct(id) {
//     const response = await fetch(`http://${ip_public}:3000/jogos/` + id, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         //body: JSON.stringify({id})
//     });

//     window.location.reload();

//     return response.json();
// }

async function procurarJogo() {
    const input = document.getElementById('procurar_jogos');
    placar_content.innerHTML = ' '

    if(input.value === ''){
        fetchJogos();
        return;
    }

    let id = parseInt(input.value);

    const response = await fetch(`http://${ip_public}:3000/jogos/${id}`);
    const jogo = await response.json();

    if(jogo.length === 0){
        alert("Não foi encontrado nenhum jogo. Por favor digite outro ID!")
        fetchJogos();
        return;
    }

    placar_content.innerHTML =
        `<div>
            <p>${jogo[0].mandante} ${jogo[0].placar_mandante} X ${jogo[0].placar_convidado} ${jogo[0].convidado}</p> 
            <button onclick="editProduct(${jogo[0].id})">Editar</button><button onclick="deleteProduct(${jogo[0].id})">Remover</button>
        </div>`

};

function criarForm(){
    placar_content1.innerHTML = 
       `<p>Criar jogo</p>
         <form id="form-create">

             <label for="mandante">Mandante</label>
             <input name="mandante" id="mandante" type="text" placeholder="Digite o mandante"></input>

             <label for="convidado-input">Convidado</label>
             <input name="convidado" id="convidado-input" type="text" placeholder="Digite o convidado"></input>
         
             <button type="submit">Criar</button>
         </form>`

     const form_create = document.getElementById('form-create');

     form_create.addEventListener('submit', function (event) {
           event.preventDefault();
           
           const formData = new FormData(form_create);
           const data = Object.fromEntries(formData.entries());
       
           criarJogo(data);

           placar_content1.innerHTML = ' ';
           fetchJogos(); 
     });
}

async function criarJogo(data) {
     console.log(data)
    
     fetch(`http://${ip_public}:3000/jogos/createJogos`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
     })
     .then(response => {
           if(!response.ok){
                throw new Error('Erro na requisição: ' + response.statusText);
           }
           return response.json();
     })
     .then(data => {
            console.log('Sucesso:', data);
     })
     .catch((error) => {
            console.error('Erro:', error);
     });      
}
