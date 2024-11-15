// Função para simular o logout
function logout() {
    alert("Você foi deslogado!");
    // Aqui, você pode redirecionar para a página de login
    window.location.href = "login.html";
}

// Funcionalidade de adicionar novo plano
document.getElementById("createPlanForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const planTitle = document.getElementById("planTitle").value;
    const planGoals = document.getElementById("planGoals").value;
    const planStartDate = document.getElementById("planStartDate").value;
    const planEndDate = document.getElementById("planEndDate").value;

    if (planTitle && planGoals && planStartDate && planEndDate) {
        // Adiciona o novo plano à lista (aqui pode ser feito um POST para o backend)
        const planList = document.getElementById("planList");
        const newPlanCard = document.createElement("div");
        newPlanCard.classList.add("card", "mb-3");

        newPlanCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${planTitle}</h5>
                <p class="card-text">Metas: ${planGoals}. Data de Início: ${planStartDate}</p>
                <button class="btn btn-info btn-sm">Ver Detalhes</button>
            </div>
        `;

        planList.appendChild(newPlanCard);
        alert("Plano criado com sucesso!");
        // Fecha o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPlanModal'));
        modal.hide();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});
