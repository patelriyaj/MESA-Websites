// URL for the Google Apps Script Web App
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTKiGW9qJxuXGseCwT8P6Boqd1Oyhkb-W8AvXEpV-6o9C6JMoPsWz9bpkx29pQkfPo/exec";

async function initSite() {
    try {
        // --- LOAD TEAM DATA ---
        const teamResponse = await fetch(`${SCRIPT_URL}?page=Team`);
        const teamData = await teamResponse.json();
        
        const coreGrid = document.getElementById('core-team-grid');
        const studentGrid = document.getElementById('student-team-grid');
        
        // Filter and display Core Leadership
        coreGrid.innerHTML = teamData
            .filter(member => member.Category === 'Core')
            .map(member => `
                <div class="member-card" data-aos="zoom-in">
                    <img src="${member.ImageURL || 'https://via.placeholder.com/150'}" alt="${member.Name}">
                    <h3>${member.Name}</h3>
                    <p class="role">${member.Role}</p>
                    <p class="info">${member.Info || ''}</p>
                </div>`).join('');

        // Filter and display Student Team Members
        studentGrid.innerHTML = teamData
            .filter(member => member.Category === 'Student')
            .map(member => `
                <div class="member-card" data-aos="fade-up">
                    <img src="${member.ImageURL || 'https://via.placeholder.com/150'}" alt="${member.Name}">
                    <h4>${member.Name}</h4>
                    <p class="role">${member.Role}</p>
                </div>`).join('');

        // --- LOAD EVENTS DATA ---
        const eventResponse = await fetch(`${SCRIPT_URL}?page=Events`);
        const eventData = await eventResponse.json();
        
        document.getElementById('upcoming-list').innerHTML = eventData
            .filter(e => e.Status === 'Upcoming')
            .map(e => `<li><i class="fas fa-calendar-alt mr-2 text-blue-500"></i> <strong>${e.EventName}</strong> - ${e.Date}</li>`).join('');
        
        document.getElementById('conducted-list').innerHTML = eventData
            .filter(e => e.Status === 'Conducted')
            .map(e => `<li><i class="fas fa-check-circle mr-2 text-green-500"></i> <strong>${e.EventName}</strong> - ${e.Date}</li>`).join('');

        // --- LOAD GALLERY DATA ---
        const galleryResponse = await fetch(`${SCRIPT_URL}?page=Gallery`);
        const galleryData = await galleryResponse.json();
        const galleryGrid = document.getElementById('gallery-grid');
        
        // Duplicate the gallery content for seamless looping animation
        const galleryItems = galleryData.map(img => `
            <div class="gallery-item">
                <img src="${img.ImageURL}" alt="${img.Caption}">
                <div class="caption-overlay">
                    <p>${img.Caption || "MESA Activity"}</p>
                </div>
            </div>`).join('');

        galleryGrid.innerHTML = `
            <div class="gallery-container">
                <div class="gallery-track">
                    ${galleryItems}
                    ${galleryItems} 
                </div>
            </div>`;

    } catch (error) {
        console.error("Critical Error loading site data:", error);
    }
}

// --- FEEDBACK FORM LOGIC ---
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('fb-submit');
    const originalBtnText = btn.innerText;
    
    btn.innerText = "Sending...";
    btn.disabled = true;

    const payload = {
        name: document.getElementById('fb-name').value,
        message: document.getElementById('fb-message').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
        alert("Success! Your feedback has been sent to the MESA Team.");
        e.target.reset();
    } catch (err) {
        alert("Error: Could not send feedback. Please try again later.");
        console.error("Form error:", err);
    } finally {
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
});

// Initialize animations and data loading
window.onload = () => {
    AOS.init({ 
        duration: 800, 
        once: true,
        offset: 100
    });
    initSite();
};