// Obter token do localStorage
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "./index.html";
}

// Função para renderizar um plano no DOM
const renderizarPlano = (plano) => {
    const planosContainer = document.querySelector(".planos");

    // Criação do elemento do plano
    const planoCard = document.createElement("div");
    planoCard.classList.add("plano");
    planoCard.innerHTML = `
        <h5>${plano.plano_titulo}</h5>
        <p>Metas: ${plano.metas}</p>
        <button class="btn detalhes-btn" data-id="${plano.id}">Ver detalhes</button>
    `;

    planosContainer.appendChild(planoCard);
};

// Buscar planos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:1910/api/planos/buscarplanos", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const planosContainer = document.querySelector(".planos");
            planosContainer.innerHTML = "<h3>Meus Planos de Estudo</h3>"; // Limpa a área de planos

            // Adiciona o botão "Criar novo plano"
            const botaoCriarPlano = document.createElement("button");
            botaoCriarPlano.classList.add("btn", "criar-plano-btn");
            botaoCriarPlano.setAttribute("data-bs-toggle", "modal");
            botaoCriarPlano.setAttribute("data-bs-target", "#addPlanModal");
            botaoCriarPlano.textContent = "Criar novo plano";
            planosContainer.appendChild(botaoCriarPlano);

            // Renderiza cada plano no DOM
            data.forEach((plano) => renderizarPlano(plano));
        })
        .catch((error) => {
            console.error("Erro ao buscar planos:", error);
            alert("Erro ao carregar os planos. Tente novamente mais tarde.");
        });
});

// Criar novo plano
document.getElementById("createPlanForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const titulo = document.getElementById("planTitle").value;
    const metas = document.getElementById("planGoals").value;

    fetch("http://localhost:1910/api/planos/novoplano", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plano_titulo: titulo, metas }),
    })
        .then((response) => response.json())
        .then((novoPlano) => {
            // Adiciona o novo plano ao DOM sem recarregar a página
            renderizarPlano(novoPlano);

            // Fecha o modal e limpa o formulário
            const modal = bootstrap.Modal.getInstance(document.getElementById("addPlanModal"));
            modal.hide();
            document.getElementById("createPlanForm").reset();

            alert("Plano criado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao criar plano:", error);
            alert("Erro ao criar plano. Tente novamente mais tarde.");
        });
});

// Redirecionar para tarefas ao clicar em "Ver detalhes"
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("detalhes-btn")) {
        const planoId = event.target.dataset.id;
        window.location.href = `/templates/tasks.html?planoId=${planoId}`;
    }
});
