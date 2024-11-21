// Obter token do localStorage
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "./index.html";
}

// Função para renderizar o botão "Criar novo plano"
const renderizarBotaoCriarPlano = () => {
    const planosContainer = document.querySelector(".planos");

    // Criação do botão "Criar novo plano"
    const botaoCriarPlano = document.createElement("button");
    botaoCriarPlano.classList.add("btn", "criar-plano-btn");
    botaoCriarPlano.setAttribute("data-bs-toggle", "modal");
    botaoCriarPlano.setAttribute("data-bs-target", "#addPlanModal");
    botaoCriarPlano.textContent = "Criar novo plano";

    planosContainer.appendChild(botaoCriarPlano);
};

// Função para renderizar um plano no DOM
const renderizarPlano = (plano) => {
    const planosContainer = document.querySelector(".planos");

    // Criação do elemento do plano
    const planoCard = document.createElement("div");
    planoCard.classList.add("plano");
    planoCard.innerHTML = `
        <h5>${plano.plano_titulo}</h5>
        <p>Metas: ${plano.metas}</p>
        <button id="${plano.id}" class="btn detalhes-btn">Ver detalhes</button>
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
            renderizarBotaoCriarPlano();

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
            renderizarPlano({
                plano_titulo: novoPlano.plano_titulo || titulo, // Usa o valor retornado ou o valor enviado
                metas: novoPlano.metas || metas, // Usa o valor retornado ou o valor enviado
                id: novoPlano.id, // Garante que o ID seja exibido corretamente
            });

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
