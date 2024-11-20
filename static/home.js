// Obter token do localStorage
const token = localStorage.getItem("token");

// Redirecionar para login se o token não existir
if (!token) {
    window.location.href = "/templates/index.html";
}

// Buscar planos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:1910/api/planos", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const planosContainer = document.querySelector(".planos");
            planosContainer.innerHTML = "<h3>Meus Planos de Estudo</h3>";

            data.forEach((plano) => {
                const planoCard = document.createElement("div");
                planoCard.classList.add("plano");

                planoCard.innerHTML = `
                    <h5>${plano.plano_titulo}</h5>
                    <p>Metas: ${plano.metas}. Data de início: ${plano.DataInicio}</p>
                    <button class="btn detalhes-btn">Ver detalhes</button>
                `;

                planosContainer.appendChild(planoCard);
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar planos:", error);
            alert("Erro ao carregar os planos. Tente novamente mais tarde.");
        });
});

// Criar novo plano
document.querySelector(".criar-plano-btn").addEventListener("click", () => {
    const titulo = prompt("Título do plano:");
    const metas = prompt("Metas do plano:");
    const DataInicio = prompt("Data de início (YYYY-MM-DD):");
    const DataFim = prompt("Data de término (YYYY-MM-DD):");

    if (titulo && metas && DataInicio && DataFim) {
        fetch("http://localhost:1910/api/planos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plano_titulo: titulo, metas, DataInicio, DataFim }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Plano criado com sucesso!");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Erro ao criar plano:", error);
                alert("Erro ao criar plano. Tente novamente mais tarde.");
            });
    }
});
