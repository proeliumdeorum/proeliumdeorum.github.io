let questions = {
    vocab: [],
    politics: [],
    culture: [],
    myth: [],
  };

  let askedQuestionsMap = {
    vocab: new Set(),
    politics: new Set(),
    culture: new Set(),
    myth: new Set(),
  };

  let currentCategory = '';

  async function fetchQuestions() {
    try {
      const categories = ['vocab', 'politics', 'culture', 'myth'];

      for (let category of categories) {
        const response = await fetch(`assets/questions/questions_${category}.json`);

        if (!response.ok) {
          throw new Error("Fehler bei "+category);
        }

        questions[category] = await response.json();
      }

      document.getElementById("loading-screen").classList.add("hidden");
      document.getElementById("title-screen").classList.remove("hidden");
    } catch (error) {
      alert("Fehler beim Laden der Fragen. Bitte überprüfen Sie die JSON-Dateien.");
    }
  }

  function startQuiz(category) {
    document.body.style.backgroundColor = getCategoryColor(category);
    document.getElementById("title-screen").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    currentCategory = category;

    loadQuestion();
  }

  function loadQuestion() {
    const questionElem = document.getElementById("question");
    const optionsElem = document.getElementById("options");
    const categoryElem = document.getElementById("category");

    questionElem.innerText = "Frage lädt...";
    optionsElem.innerHTML = "";
    categoryElem.innerText = {
      vocab: "Vokabeln",
      politics: "Römische Geschichte und Politik",
      culture: "Römische Kultur",
      myth: "Antike Mythologie",
    }[currentCategory];

    let askedQSet = askedQuestionsMap[currentCategory];

    let availableQuestions = questions[currentCategory].filter(q => !askedQSet.has(q.question));

    if (availableQuestions.length === 0) {
      askedQSet.clear();
      availableQuestions = questions[currentCategory];
    }

    if (availableQuestions.length === 0) {
      questionElem.innerText = "Keine Fragen in dieser Kategorie!";
      return;
    }

    let question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    askedQSet.add(question.question);

    questionElem.innerText = question.question;

    let shuffledOptions = [...question.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach((option) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.classList.add("answer-button");
      button.onclick = () => revealAnswer(button, option === question.correct);
      optionsElem.appendChild(button);
    });
  }

  function revealAnswer(button, isCorrect) {
    const allButtons = document.querySelectorAll(".answer-button");
    allButtons.forEach(btn => {
      btn.disabled = true;
    });

    button.classList.add(isCorrect ? "correct" : "incorrect");

    if (!isCorrect) {
      const questionText = document.getElementById("question").innerText;
      const currentQ = questions[currentCategory].find(q => q.question === questionText);
      if (currentQ) {
        const correctAnswer = currentQ.correct;
        allButtons.forEach(btn => {
          if (btn.innerText === correctAnswer) {
            btn.classList.add("correct");
          }
        });
      }
    }

    setTimeout(() => {
      document.getElementById("quiz").classList.add("hidden");
      document.getElementById("title-screen").classList.remove("hidden");
      document.body.style.backgroundColor = "#f4e4c1";
    }, 5000);
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function getCategoryColor(category) {
    return {
      vocab: "#425074",
      politics: "#58653e",
      culture: "#6e2121",
      myth: "#b46217",
    }[category] || "#f4e4c1";
  }

  fetchQuestions();