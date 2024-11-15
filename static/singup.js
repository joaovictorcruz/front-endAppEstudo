document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("Name").value;
    const dataNasc = document.getElementById("date").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const confirmSenha = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("signupError");

    if (senha !== confirmSenha) {
        errorMessage.textContent = "As senhas não coincidem!";
        return;
    }

    fetch("http://localhost:1910/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, dataNasc, email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "../templates/home.html";
        } else {
            errorMessage.textContent = data.erro || "Erro desconhecido.";
        }
    })
    .catch(error => {
        console.error("Erro ao cadastrar usuário:", error);
        errorMessage.textContent = "Erro ao cadastrar usuário. Tente novamente mais tarde.";
    });
});

