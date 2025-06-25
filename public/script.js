
// --------------- BLOC 1 : TEXTE ------------------
const submitButtonText = document.getElementById("submitBtnText");
const inputText = document.getElementById("promptText");
const resultText = document.querySelector(".text-result");

submitButtonText.addEventListener("click", async (e) => {
    e.preventDefault();

    resultText.innerHTML = "Recherche en cours...";
    let inputValue = inputText.value;

    try {
        let response = await fetch(`http://localhost:3001/api/gemini`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: inputValue }] }]
            }),
        });

        if (!response.ok) {
            throw new Error("erreur API", response.statusText);
        }

        let data = await response.json();
        console.log("data", data);
        resultText.innerHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur.";
        console.log("data.candidates", data.candidates);
        console.log("data.candidates.content.parts.text", data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
        console.log("erreur", error);
        resultText.innerHTML = "Erreur attrapée dans le bloc texte.";
    }
});

// --------------- BLOC 2 : IMAGE + TEXTE ------------------
const submitButton = document.getElementById("submitBtn");
const input = document.getElementById("prompt");
const result = document.querySelector(".result");
const fileInput = document.getElementById("chosenImage");

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    result.innerHTML = "Recherche en cours...";
    let inputValue = input.value;
    let file = fileInput.files[0];

    if (!file) {
        result.innerHTML = "Aucun fichier sélectionné.";
        return;
    }

    let reader = new FileReader();
//split pour recuperer après la virgule : data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD etc...
         //avant la virgule c'est le type de l'image
    reader.onload = async () => {
        try {
            let image = reader.result;
            let imageBase64 = image.split(",")[1];

            let response = await fetch(`http://localhost:3001/api/gemini`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [
                            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
                            { text: inputValue }
                        ]
                    }]
                }),
            });

            if (!response.ok) {
                throw new Error("erreur API", response.statusText);
            }

            let data = await response.json();
            result.innerHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur.";
        } catch (error) {
            console.log("erreur", error);
            result.innerHTML = "Erreur attrapée dans le bloc image.";
        }
    };
// Lire le fichier et le convertir
    reader.readAsDataURL(file);
});
