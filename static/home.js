// Obter token do localStorage
const token = localStorage.getItem("token");
console.log(token)
// Redirecionar para login se o token não existir
if (!token) {
    window.location.href = "./index.html";
}

// Buscar planos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:1910/api/planos/buscarplano", {
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
                    <button id="${plano.id}" class="btn detalhes-btn">Ver detalhes</button>
                `;

                planosContainer.appendChild(planoCard);
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar planos:", error);
            console.log("Erro ao carregar os planos. Tente novamente mais tarde.");
        });
});

document.getElementById("createPlanForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const titulo = document.getElementById("planTitle").value;
    const metas = document.getElementById("planGoals").value;
    const DataInicio = document.getElementById("planStartDate").value;
    const DataFim = document.getElementById("planEndDate").value;

    fetch("http://localhost:1910/api/planos/novoplano", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plano_titulo: titulo, metas, DataInicio, DataFim }),
    })
        .then((response) => response.json())
        .then(() => {
            alert("Plano criado com sucesso!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erro ao criar plano:", error);
            alert("Erro ao criar plano. Tente novamente mais tarde.");
        });
        
});

document.getElementById("editPlanForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const planoId = event.target.id ; // Obtenha o ID do plano (armazenado em algum lugar)
    const titulo = document.getElementById("editPlanTitle").value;
    const metas = document.getElementById("editPlanGoals").value;
    const DataInicio = document.getElementById("editPlanStartDate").value;
    const DataFim = document.getElementById("editPlanEndDate").value;

    fetch("http://localhost:1910/api/planos/editarplano", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planoId, plano_titulo: titulo, metas, DataInicio, DataFim }),
    })
        .then(() => {
            alert("Plano atualizado com sucesso!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erro ao editar plano:", error);
        });
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("detalhes-btn")) {
        const planoId = event.target.dataset.id;

        fetch("http://localhost:1910/api/planos/excluirplano", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ planoId }),
        })
            .then(() => {
                alert("Plano deletado com sucesso!");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Erro ao excluir plano:", error);
            });
    }
});

