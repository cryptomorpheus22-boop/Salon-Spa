/* ================================
   BOTSWANA SPA - MAIN JAVASCRIPT
   WhatsApp Demo Modal & Interactions
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalChat = document.getElementById('modalChat');
    const modalActions = document.getElementById('modalActions');
    const tryAiBooking = document.getElementById('tryAiBooking');

    // State
    let bookingState = {
        step: 0,
        service: null,
        dateTime: null
    };

    // Services Data
    const services = [
        { id: 'hair', name: 'Hair Styling', price: 'P250', emoji: '✂️' },
        { id: 'massage', name: 'Massage Therapy', price: 'P400', emoji: '💆' },
        { id: 'nail', name: 'Nail & Skin Care', price: 'P180', emoji: '💅' }
    ];

    // Time slots
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // ===== Navigation =====

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== WhatsApp Demo Modal =====

    // Open modal
    tryAiBooking.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    // Also handle "View all services" link click
    const viewAllServices = document.getElementById('viewAllServices');
    if (viewAllServices) {
        viewAllServices.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    // Close modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal() {
        // Reset state
        bookingState = { step: 0, service: null, dateTime: null };
        modalChat.innerHTML = '';
        modalActions.innerHTML = '';

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Start conversation
        startConversation();
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function startConversation() {
        // Show typing indicator then greeting
        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();
            addBotMessage("Hello! 👋 Welcome to Botswana Spa. I'm your AI booking assistant.");

            setTimeout(() => {
                showTypingIndicator();
                setTimeout(() => {
                    hideTypingIndicator();
                    addBotMessage("I can help you book an appointment. Which service would you like?");
                    showServiceOptions();
                }, 1200);
            }, 800);
        }, 1500);
    }

    function addBotMessage(text) {
        const time = getCurrentTime();
        const messageHTML = `
            <div class="chat-message bot">
                ${text}
                <div class="chat-time">${time}</div>
            </div>
        `;
        modalChat.insertAdjacentHTML('beforeend', messageHTML);
        scrollChatToBottom();
    }

    function addUserMessage(text) {
        const time = getCurrentTime();
        const messageHTML = `
            <div class="chat-message user">
                ${text}
                <div class="chat-time">${time}</div>
            </div>
        `;
        modalChat.insertAdjacentHTML('beforeend', messageHTML);
        scrollChatToBottom();
    }

    function showTypingIndicator() {
        const typingHTML = `
            <div class="typing-indicator" id="typingIndicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        modalChat.insertAdjacentHTML('beforeend', typingHTML);
        scrollChatToBottom();
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollChatToBottom() {
        modalChat.scrollTop = modalChat.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function showServiceOptions() {
        modalActions.innerHTML = services.map(service => `
            <button class="action-btn" data-service="${service.id}">
                ${service.emoji} ${service.name}
            </button>
        `).join('');

        modalActions.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => handleServiceSelection(btn.dataset.service));
        });
    }

    function handleServiceSelection(serviceId) {
        const service = services.find(s => s.id === serviceId);
        bookingState.service = service;
        bookingState.step = 1;

        // Show user's choice
        addUserMessage(`${service.emoji} ${service.name}`);
        modalActions.innerHTML = '';

        // Bot responds
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                addBotMessage(`Great choice! ${service.name} starts from ${service.price}.`);

                setTimeout(() => {
                    showTypingIndicator();
                    setTimeout(() => {
                        hideTypingIndicator();
                        addBotMessage("What date and time would work best for you? We're open Mon-Sat 8am-7pm, Sun 10am-4pm.");
                        showDateTimeOptions();
                    }, 1000);
                }, 600);
            }, 1200);
        }, 500);
    }

    function showDateTimeOptions() {
        // Generate next 3 days
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 3; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dates.push({ label: `${dayName}, ${dateStr}`, date: date });
        }

        modalActions.innerHTML = `
            <div style="width: 100%; margin-bottom: 8px;">
                ${dates.map(d => `
                    <button class="action-btn date-btn" data-date="${d.date.toISOString()}" style="margin-bottom: 8px;">
                        📅 ${d.label}
                    </button>
                `).join('')}
            </div>
        `;

        modalActions.querySelectorAll('.date-btn').forEach(btn => {
            btn.addEventListener('click', () => handleDateSelection(btn.dataset.date, btn.textContent.trim()));
        });
    }

    function handleDateSelection(dateISO, dateLabel) {
        const date = new Date(dateISO);
        bookingState.date = date;

        addUserMessage(dateLabel);
        modalActions.innerHTML = '';

        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                addBotMessage("Perfect! What time works for you?");
                showTimeOptions();
            }, 800);
        }, 400);
    }

    function showTimeOptions() {
        modalActions.innerHTML = timeSlots.slice(0, 6).map(time => `
            <button class="action-btn time-btn" data-time="${time}">
                🕐 ${time}
            </button>
        `).join('');

        modalActions.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => handleTimeSelection(btn.dataset.time));
        });
    }

    function handleTimeSelection(time) {
        bookingState.time = time;
        bookingState.step = 2;

        addUserMessage(`🕐 ${time}`);
        modalActions.innerHTML = '';

        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();

                const dateStr = bookingState.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                });

                addBotMessage(`
                    ✅ <strong>Booking Confirmed!</strong><br><br>
                    📋 <strong>Service:</strong> ${bookingState.service.name}<br>
                    📅 <strong>Date:</strong> ${dateStr}<br>
                    🕐 <strong>Time:</strong> ${time}<br>
                    💰 <strong>Starting from:</strong> ${bookingState.service.price}<br><br>
                    You'll receive a reminder 24 hours before your appointment. See you soon! 🌿
                `);

                // Save to localStorage
                saveBooking();

                setTimeout(() => {
                    showFinalOptions();
                }, 600);
            }, 1500);
        }, 500);
    }

    function showFinalOptions() {
        modalActions.innerHTML = `
            <button class="action-btn" id="bookAnother">📅 Book Another</button>
            <button class="action-btn" id="closeChat" style="background-color: var(--primary-green); color: white; border-color: var(--primary-green);">✓ Done</button>
        `;

        document.getElementById('bookAnother').addEventListener('click', () => {
            modalChat.innerHTML = '';
            bookingState = { step: 0, service: null, dateTime: null };
            startConversation();
        });

        document.getElementById('closeChat').addEventListener('click', closeModal);
    }

    function saveBooking() {
        const booking = {
            service: bookingState.service.name,
            date: bookingState.date.toISOString(),
            time: bookingState.time,
            price: bookingState.service.price,
            bookedAt: new Date().toISOString()
        };

        // Get existing bookings or create new array
        let bookings = JSON.parse(localStorage.getItem('botswanaSpaBookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('botswanaSpaBookings', JSON.stringify(bookings));

        console.log('Booking saved:', booking);
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== Initialize =====
    console.log('Botswana Spa website loaded successfully! 🌿');
});
