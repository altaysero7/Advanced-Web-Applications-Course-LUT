// Referencing week 8-9 source code

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form").addEventListener("submit", onSubmitUserInfo);
});

function onSubmitUserInfo(event) {
    event.preventDefault();
    const loginData = new FormData(event.target);

    fetch("/api/user/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(loginData))
    })
        .then(async response => {
            if (!response.ok) {
                return Promise.reject(await response.text());
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem("auth_token", data.token);
                window.location.href = "/";
            }
        })
        .catch(error => {
            document.getElementById("displayError").innerHTML = error || "An error occurred while logging in. Please try again.";
        });
}
