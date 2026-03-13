document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    if (!container) return;

    // 1. Protection contre les erreurs de parsing JSON
    let cards = [];
    try {
        cards = JSON.parse(container.dataset.cards);
    } catch (e) {
        console.error("Erreur de parsing des cartes :", e);
        return;
    }

    const deckId = container.dataset.deckId;
    let currentIndex = 0;
    let score = 0;
    let isTransitioning = false;

    const cardInner = document.getElementById('card-inner');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const scoreDisplay = document.getElementById('current-score');
    const cardElement = document.getElementById('card-element');

    // Flip de la carte
    if (cardElement) {
        cardElement.addEventListener('click', (e) => {
            if (!e.target.closest('.game-actions') && !isTransitioning) {
                cardInner.classList.toggle('is-flipped');
            }
        });
    }

    // 2. RENDRE LA FONCTION GLOBALE POUR onclick=""
    window.nextCard = (isCorrect) => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (isCorrect) {
            score++;
            if (scoreDisplay) scoreDisplay.innerText = score;
        }

        currentIndex++;

        // 3. LOGIQUE DE TRANSITION : On retourne la carte, puis on change le texte
        cardInner.classList.remove('is-flipped');

        // On attend la fin de l'animation de flip (300ms) avant de changer le texte
        setTimeout(() => {
            showCard();
            isTransitioning = false;
        }, 300);
    };

    function showCard() {
        if (currentIndex < cards.length) {
            // Mise à jour des textes
            questionText.innerText = cards[currentIndex].question;
            answerText.innerText = cards[currentIndex].answer;
        } else {
            showResults();
        }
    }

function showResults() {
    if (!deckId) return;
    // URL simplifiée sans le mode
    window.location.href = `/game/${deckId}/result?score=${score}&total=${cards.length}`;
}

    // Premier affichage
    showCard();
});