async function loadReviews() {
    try {
        const response = await fetch("./review.json");

        if (!response.ok) {
            throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        const reviewsSection = document.createElement("section");
        reviewsSection.className = "reviews";

        const heading = document.createElement("h2");
        heading.innerText = "What Our Customers Say";
        reviewsSection.appendChild(heading);

        const container = document.createElement("div");
        container.id = "reviewsContainer";

        data.reviews.forEach(r => {
            const card = document.createElement("div");
            card.className = "review-card";

            card.innerHTML = `
                <p>"${r.review}"</p>
                <h4>${r.name}</h4>
                <span>${"⭐".repeat(r.rating)}</span>
            `;

            container.appendChild(card);
        });

        reviewsSection.appendChild(container);

        document.body.appendChild(reviewsSection);

    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}

loadReviews();
