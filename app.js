const ip_public = '';
const placar_title = document.getElementById('placar-title');
const placar_content = document.getElementById('placar-content1');
const placar_content1 = document.getElementById('placar-content2');
const btn_procurar = document.getElementById('procurar-btn');
const criar_jogo = document.getElementById('criar-jogo');

criar_jogo.addEventListener('click', formularioCriarJogo);
btn_procurar.addEventListener('click', procurarJogo);

//função carregar os jogos a partir do banco de dados
async function fetchJogos() {
    const response = await fetch(`http://${ip_public}:3000/jogos`);
    const jogos = await response.json();

    placar_content.innerHTML = '';

    jogos.forEach(jogo => {
        const li = document.createElement('li');
        li.classList.add('placar-list');
        li.dataset.id = jogo.id;

        visualizarJogos(jogo, li);

        placar_content.appendChild(li);
    });
}

//função para visualização dos jogos
function visualizarJogos(jogo, container) {
    container.innerHTML = '';

    const div = document.createElement('div');

    const p = document.createElement('p');
    p.textContent = `${jogo.mandante} ${jogo.placar_mandante} X ${jogo.placar_convidado} ${jogo.convidado}`;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => {
        editarJogo(jogo, container);
    });

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', () => {
        deletarJogo(jogo.id);
    });

    div.appendChild(p);
    div.appendChild(btnEditar);
    div.appendChild(btnRemover);

    container.appendChild(div);
}

//função para edição dos jogos e salvar no banco de dados
function editarJogo(jogo, container) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '6px';

    function criarCampo(labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '10px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.minWidth = '150px';

        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);

        return wrapper;
    }

    const mandanteInput = document.createElement('input');
    mandanteInput.type = 'text';
    mandanteInput.value = jogo.mandante;

    const placarMandanteInput = document.createElement('input');
    placarMandanteInput.type = 'number';
    placarMandanteInput.value = jogo.placar_mandante;

    const convidadoInput = document.createElement('input');
    convidadoInput.type = 'text';
    convidadoInput.value = jogo.convidado;

    const placarConvidadoInput = document.createElement('input');
    placarConvidadoInput.type = 'number';
    placarConvidadoInput.value = jogo.placar_convidado;

    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = 'Salvar';
    btnSalvar.addEventListener('click', () => {
        const data = {
            mandante: mandanteInput.value,
            placar_mandante: parseInt(placarMandanteInput.value, 10) || 0,
            placar_convidado: parseInt(placarConvidadoInput.value, 10) || 0,
            convidado: convidadoInput.value
        };
        updateJogo(jogo.id, data);
    });

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.addEventListener('click', () => {
        fetchJogos();
    });

    div.appendChild(criarCampo('Mandante', mandanteInput));
    div.appendChild(criarCampo('Placar Mandante', placarMandanteInput));
    div.appendChild(criarCampo('Convidado', convidadoInput));
    div.appendChild(criarCampo('Placar Convidado', placarConvidadoInput));


    const botoes = document.createElement('div');
    botoes.style.marginTop = '10px';
    botoes.appendChild(btnSalvar);
    botoes.appendChild(btnCancelar);

    div.appendChild(botoes);
    container.appendChild(div);
}


//função para deletar  jogo
async function deletarJogo(id) {
    await fetch(`http://${ip_public}:3000/jogos/` + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    fetchJogos();
}

//função para realizar update em jogo a partir de uma edição
async function updateJogo(id, data) {
    try {
        const response = await fetch(`http://${ip_public}:3000/jogos/` + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar jogo: ' + response.statusText);
        }

        fetchJogos();
    } catch (err) {
        console.error(err);
        alert('Erro ao salvar alterações do jogo.');
    }
}

//função procurar jogo
async function procurarJogo() {
    const input = document.getElementById('procurar_jogos');
    placar_content.innerHTML = '';

    if (input.value === '') {
        fetchJogos();
        return;
    }

    let id = parseInt(input.value);

    const response = await fetch(`http://${ip_public}:3000/jogos/${id}`);
    const jogo = await response.json();

    if (jogo.length === 0) {
        alert("Não foi encontrado nenhum jogo. Por favor digite outro ID!");
        fetchJogos();
        return;
    }

    const li = document.createElement('li');
    li.classList.add('placar-list');
    li.dataset.id = jogo[0].id;

    visualizarJogos(jogo[0], li);
    placar_content.appendChild(li);
}

//função para criar exibir a parte da página que cria um novo jogo a partir do formulário
function formularioCriarJogo() {
    placar_content1.innerHTML =
        `<p style="margin-bottom: 15px; margin-top: 15px">Criar jogo</p>
         <form id="form-create" style="display: flex; flex-direction: column; gap: 10px;">

             <div>
                 <label for="mandante">Mandante</label>
                 <input name="mandante" id="mandante" type="text" placeholder="Digite o mandante">
             </div>

             <div>
                 <label for="placar_mandante">Placar Mandante</label>
                 <input name="placar_mandante" id="placar_mandante" type="number" min="0" value="0">
             </div>

             <div>
                 <label for="convidado-input">Convidado</label>
                 <input name="convidado" id="convidado-input" type="text" placeholder="Digite o convidado">
             </div>

             <div>
                 <label for="placar_convidado">Placar Convidado</label>
                 <input name="placar_convidado" id="placar_convidado" type="number" min="0" value="0">
             </div>

             <div style="margin-top: 10px;">
                 <button type="submit">Criar</button>
                 <button type="button" id="cancelar-criacao">Cancelar</button>
             </div>

         </form>`;

    const form_create = document.getElementById('form-create');
    const btnCancelar = document.getElementById('cancelar-criacao');

    btnCancelar.addEventListener('click', () => {
        placar_content1.innerHTML = '';
    });

    form_create.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form_create);
        const data = Object.fromEntries(formData.entries());

        data.placar_mandante = parseInt(data.placar_mandante, 10) || 0;
        data.placar_convidado = parseInt(data.placar_convidado, 10) || 0;

        criarJogo(data);

        placar_content1.innerHTML = '';
        fetchJogos();
    });
}


//função criar jogo no banco de dados
async function criarJogo(data) {
    console.log(data);

    fetch(`http://${ip_public}:3000/jogos/createJogos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
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
