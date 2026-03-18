const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTKiGW9qJxuXGseCwT8P6Boqd1Oyhkb-W8AvXEpV-6o9C6JMoPsWz9bpkx29pQkfPo/exec";

// Fetch data for all sections
async function initSite() {
    try {
        // Load Team
        const teamData = await fetch(`${SCRIPT_URL}?page=Team`).then(res => res.json());
        const coreGrid = document.getElementById('core-team-grid');
        const studentGrid = document.getElementById('student-team-grid');
        
        coreGrid.innerHTML = teamData.filter(m => m.Category === 'Core').map(m => `
            <div class="member-card" data-aos="zoom-in">
                <img src="${m.ImageURL}" alt="${m.Name}">
                <h3>${m.Name}</h3>
                <p class="role">${m.Role}</p>
                <p class="info">${m.Info}</p>
            </div>`).join('');

        studentGrid.innerHTML = teamData.filter(m => m.Category === 'Student').map(m => `
            <div class="member-card" data-aos="fade-up">
                <img src="${m.ImageURL}" alt="${m.Name}">
                <h4>${m.Name}</h4>
                <p class="role">${m.Role}</p>
            </div>`).join('');

        // Load Events
        const eventData = await fetch(`${SCRIPT_URL}?page=Events`).then(res => res.json());
        document.getElementById('upcoming-list').innerHTML = eventData
            .filter(e => e.Status === 'Upcoming')
            .map(e => `<li><strong>${e.EventName}</strong> - ${e.Date}</li>`).join('');
        
        document.getElementById('conducted-list').innerHTML = eventData
            .filter(e => e.Status === 'Conducted')
            .map(e => `<li><strong>${e.EventName}</strong> - ${e.Date}</li>`).join('');

        // Load Gallery
        const galleryData = await fetch(`${SCRIPT_URL}?page=Gallery`).then(res => res.json());
        document.getElementById('gallery-grid').innerHTML = galleryData.map(img => `
            <div class="gallery-item">
                <img src="${img.ImageURL}" alt="${img.Caption}">
            </div>`).join('');

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Handle Form Submission
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('fb-submit');
    btn.innerText = "Sending...";
    btn.disabled = true;

    const payload = {
        name: document.getElementById('fb-name').value,
        message: document.getElementById('fb-message').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Critical for Google Scripts
            body: JSON.stringify(payload)
        });
        alert("Thank you! Feedback recorded.");
        e.target.reset();
    } catch (err) {
        alert("Something went wrong. Please try again.");
    } finally {
        btn.innerText = "Send Feedback";
        btn.disabled = false;
    }
});

// Initialize
window.onload = () => {
    AOS.init({ duration: 800, once: true });
    initSite();
};