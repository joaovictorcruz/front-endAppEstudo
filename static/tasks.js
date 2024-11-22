// Obter token do localStorage
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "./index.html";
}

// Obter ID do plano da URL (query string)
const urlParams = new URLSearchParams(window.location.search);
const planoId = urlParams.get("planoId");

// Função para formatar a data e remover o sufixo desnecessário
const formatarData = (data) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(data).toLocaleDateString("pt-BR", options); // DD/MM/AAAA
};

// Renderizar tarefas no DOM
const renderizarTarefa = (tarefa) => {
    const tarefasContainer = document.getElementById("tasksContainer");

    const tarefaCard = document.createElement("div");
    tarefaCard.classList.add("task-item");

    const statusStyle = tarefa.status === "Concluída" ? "color:#51c120;font-weight:700;" : "color:red;";

    tarefaCard.innerHTML = `
        <h5>
            ${tarefa.tarefa_titulo}
            <span style="${statusStyle}">(${tarefa.status})</span>
        </h5>
        <p>${tarefa.desc_conteudo}</p>
        <p>Data de Vencimento: ${formatarData(tarefa.data_vencimento)}</p>
        <button class="btn finalizar-btn" data-id="${tarefa.id}">Finalizar</button>
        <button class="btn editar-btn" data-id="${tarefa.id}">Editar</button>
        <button class="btn excluir-btn btn-danger" data-id="${tarefa.id}">Excluir</button>
    `;

    tarefasContainer.appendChild(tarefaCard);
};

// Carregar tarefas associadas ao plano
document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:1910/api/tasks/buscar/${planoId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((tarefas) => {
            const tarefasContainer = document.getElementById("tasksContainer");
            tarefasContainer.innerHTML = ""; // Limpa as tarefas exibidas

            tarefas.forEach((tarefa) => renderizarTarefa(tarefa));

            // Adicionando os ouvintes de eventos após as tarefas terem sido renderizadas
            addDeleteListeners(); // Função para adicionar os ouvintes de evento de exclusão
        })
        .catch((error) => {
            console.error("Erro ao carregar tarefas:", error);
            console.log("Erro ao carregar tarefas. Tente novamente mais tarde.");
        });
});

// Função para adicionar os ouvintes de eventos de excluir após renderizar as tarefas
const addDeleteListeners = () => {
    const excluirBtns = document.querySelectorAll(".excluir-btn");
    excluirBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const tarefaId = event.target.dataset.id;

            fetch("http://localhost:1910/api/tasks/deletar", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ tarefaId }), // Passando tarefaId no corpo da requisição
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "Tarefa excluída com sucesso!") {
                        alert("Tarefa excluída com sucesso!");
                        event.target.closest(".task-item").remove(); // Remove o item da lista
                    } else {
                        alert("Erro ao excluir tarefa.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao excluir tarefa:", error);
                    alert("Erro ao excluir tarefa. Tente novamente mais tarde.");
                });
        });
    });
};

// Criar nova tarefa
document.getElementById("createTaskForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const titulo = document.getElementById("taskTitle").value;
    const descricao = document.getElementById("taskDescription").value;
    const dataVencimento = document.getElementById("taskDate").value;

    fetch("http://localhost:1910/api/tasks/adicionar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tarefa_titulo: titulo,
            desc_conteudo: descricao,
            data_vencimento: dataVencimento,
            planoId: planoId,
        }),
    })
        .then((response) => response.json())
        .then((novaTarefa) => {
            renderizarTarefa(novaTarefa);
            document.getElementById("createTaskForm").reset();

            const modal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
            modal.hide();

            alert("Tarefa criada com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao criar tarefa:", error);
            alert("Erro ao criar tarefa. Tente novamente mais tarde.");
        });
});

// Editar tarefa
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("editar-btn")) {
        const tarefaId = event.target.dataset.id;
        localStorage.setItem("tarefaId", tarefaId)

        // Obter dados da tarefa para preencher o modal
        fetch(`http://localhost:1910/api/tasks/buscar/tarefa/${tarefaId}`, { // Requisição para a nova rota de busca
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((tarefa) => {
                // Preencher os campos do modal de edição com os dados da tarefa
                if (tarefa) {
                    document.getElementById("editTaskTitle").value = tarefa.tarefa_titulo;
                    document.getElementById("editTaskDescription").value = tarefa.desc_conteudo;
                    document.getElementById("editTaskDate").value = tarefa.data_vencimento;
                    document.getElementById("editTaskId").value = tarefa.id;

                    // Exibir o modal após preencher os campos
                    const modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
                    modal.show();
                } else {
                    alert("Tarefa não encontrada.");
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar tarefa:", error);
                alert("Erro ao carregar tarefa para edição.");
            });
    }
});


// Alterando o evento de submit para capturar o ID da tarefa ao editar
// Editar tarefa
document.getElementById("editTaskForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const tarefaId = localStorage.getItem("tarefaId")   
    const titulo = document.getElementById("editTaskTitle").value;
    const descricao = document.getElementById("editTaskDescription").value;
    const dataVencimento = document.getElementById("editTaskDate").value;

    // Alterando o fetch para usar a URL correta com o ID da tarefa
    fetch(`http://localhost:1910/api/tasks/editar/${tarefaId}`, { // Agora o caminho inclui o tarefaId
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tarefa_titulo: titulo,
            desc_conteudo: descricao,
            data_vencimento: dataVencimento,
            status: "Atualizada", // Definindo o status como "Atualizada"
        }),
    })
        .then((response) => response.json())
        .then(() => {
            alert("Tarefa atualizada com sucesso!");
            window.location.reload(); // Atualiza a lista de tarefas
        })
        .catch((error) => {
            console.error("Erro ao editar tarefa:", error);
            alert("Erro ao editar tarefa. Tente novamente mais tarde.");
        });
});

// Função para adicionar evento de finalizar tarefas
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("finalizar-btn")) {
        const tarefaId = event.target.dataset.id;

        fetch(`http://localhost:1910/api/tasks/finalizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tarefaId }), // Passando tarefaId no corpo da requisição
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Tarefa finalizada com sucesso!") {
                    alert(data.message);
                    window.location.reload(); // Recarrega as tarefas atualizadas
                } else {
                    alert("Erro ao finalizar a tarefa.");
                }
            })
            .catch((error) => {
                console.error("Erro ao finalizar a tarefa:", error);
                alert("Erro ao finalizar a tarefa. Tente novamente mais tarde.");
            });
    }
});