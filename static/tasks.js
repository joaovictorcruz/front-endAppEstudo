// Obter token do localStorage
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "./index.html";
}

// Obter ID do plano da URL (query string)
const urlParams = new URLSearchParams(window.location.search);
const planoId = urlParams.get("planoId");

// Função para renderizar tarefa no DOM
const renderizarTarefa = (tarefa) => {
    const tarefasContainer = document.querySelector(".tarefas .tarefa");

    const tarefaCard = document.createElement("div");
    tarefaCard.classList.add("plano"); // Reutiliza a estilização de "plano"
    tarefaCard.innerHTML = `
        <h5>${tarefa.tarefa_titulo}</h5>
        <p>${tarefa.desc_conteudo}</p>
        <p>Data de Vencimento: ${tarefa.data_vencimento}</p>
        <button class="btn detalhes-btn" data-id="${tarefa.id}">Editar</button>
        <button class="btn btn-danger excluir-btn" data-id="${tarefa.id}">Excluir</button>
    `;

    tarefasContainer.appendChild(tarefaCard);
};

// Carregar tarefas do plano selecionado
document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:1910/api/tarefas/${planoId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const tarefasContainer = document.querySelector(".tarefas .tarefa");
            tarefasContainer.innerHTML = ""; // Limpa as tarefas atuais

            data.forEach((tarefa) => renderizarTarefa(tarefa));
        })
        .catch((error) => {
            console.error("Erro ao carregar tarefas:", error);
            alert("Erro ao carregar tarefas. Tente novamente mais tarde.");
        });
});

// Criar nova tarefa
document.getElementById("createTaskForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const titulo = document.getElementById("taskTitle").value;
    const descricao = document.getElementById("taskDescription").value;
    const dataVencimento = document.getElementById("taskDueDate").value;

    fetch("http://localhost:1910/api/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tarefa_titulo: titulo,
            desc_conteudo: descricao,
            data_vencimento: dataVencimento,
            planoId: planoId, // Vincular ao plano atual
        }),
    })
        .then((response) => response.json())
        .then((novaTarefa) => {
            renderizarTarefa(novaTarefa); // Adiciona a nova tarefa no DOM
            document.getElementById("createTaskForm").reset(); // Limpa o formulário

            const modal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
            modal.hide();

            alert("Tarefa criada com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao criar tarefa:", error);
            alert("Erro ao criar tarefa. Tente novamente mais tarde.");
        });
});

// Excluir tarefa
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("excluir-btn")) {
        const tarefaId = event.target.dataset.id;

        fetch(`http://localhost:1910/api/tarefas/${tarefaId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                event.target.parentElement.remove(); // Remove a tarefa do DOM
                alert("Tarefa excluída com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao excluir tarefa:", error);
                alert("Erro ao excluir tarefa. Tente novamente mais tarde.");
            });
    }
});
