    // Obter token do localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "./index.html";
    }

    function logout() {
        localStorage.removeItem("token"); // Remove o token de autenticação
        localStorage.removeItem("userName"); // Remove o nome do usuário
        window.location.href = "./index.html"; // Redireciona para a página de login
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
            <!-- Botão Editar gerado dinamicamente -->
            <button class="btn editar-btn" data-id="${plano.id}">Editar</button>
            <!-- Botão Excluir gerado dinamicamente -->
            <button class="btn excluir-btn" data-id="${plano.id}">Excluir</button>
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
                console.log("Erro ao carregar os planos. Tente novamente mais tarde.");
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
            .then(() => {
                // Recarrega a página para garantir que os dados sejam atualizados
                window.location.reload();
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

    // Função para adicionar os ouvintes de eventos de Editar e Excluir
// Editar plano
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("editar-btn")) {
        const planoId = event.target.dataset.id;

        // Corrigir a URL para corresponder à rota correta no back-end
        fetch(`http://localhost:1910/api/planos/buscarplanos/${planoId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((plano) => {
            if (plano) {
                // Preenche o formulário de edição com os dados do plano
                document.getElementById("editPlanId").value = plano.id; // Preenche o campo hidden com o id
                document.getElementById("editPlanTitle").value = plano.plano_titulo;
                document.getElementById("editPlanGoals").value = plano.metas;

                // Exibe o modal de edição
                const modal = new bootstrap.Modal(document.getElementById("editPlanModal"));
                modal.show();
            } else {
                alert("Plano não encontrado.");
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar plano:", error);
            alert("Erro ao carregar plano para edição.");
        });
    }

        // Excluir plano
        if (event.target.classList.contains("excluir-btn")) {
            const planoId = event.target.dataset.id;

            if (confirm("Você tem certeza que deseja excluir este plano e suas tarefas?")) {
                fetch(`http://localhost:1910/api/planos/excluirplano`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ planoId }), // Passa o planoId no corpo da requisição
                })
                    .then((response) => response.json())
                    .then(() => {
                        // Recarrega a página para refletir a exclusão
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Erro ao excluir plano:", error);
                        alert("Erro ao excluir plano. Tente novamente mais tarde.");
                    });
            }
        }
    });

// Atualizar plano (editar)
document.getElementById("editPlanForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const planoId = document.getElementById("editPlanId").value; // Agora o planoId é acessado corretamente
    const titulo = document.getElementById("editPlanTitle").value;
    const metas = document.getElementById("editPlanGoals").value;

    if (!titulo || !metas) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    fetch("http://localhost:1910/api/planos/editarplano", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planoId, plano_titulo: titulo, metas }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.message === "Plano atualizado com sucesso!") {
            alert("Plano atualizado com sucesso!");
            window.location.reload(); // Atualiza a página para refletir as mudanças
        } else {
            alert("Erro ao atualizar plano.");
        }
    })
    .catch((error) => {
        console.error("Erro ao editar plano:", error);
        alert("Erro ao editar plano. Tente novamente mais tarde.");
    });
});

