document.querySelector(".form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const errorMessage = document.getElementById("loginError");

    fetch("http://localhost:1910/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "../templates/home.html";
        } else {
            errorMessage.textContent = data.erro || "Senha incorreta, tente novamente.";
        }
    })
    .catch(error => {
        console.error("Erro ao fazer login:", error);
        errorMessage.textContent = "Erro ao fazer login. Tente novamente mais tarde.";
    });
});
