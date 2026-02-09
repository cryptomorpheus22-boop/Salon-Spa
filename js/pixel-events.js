/**
 * Pixel Events for Salon & Spa Demo
 * Tracks user interactions for Meta Ads optimization
 */

document.addEventListener('DOMContentLoaded', function () {
    // Helper function to track Facebook Pixel events safely
    function trackPixelEvent(eventName, params) {
        if (typeof fbq === 'function') {
            fbq('track', eventName, params);
            console.log(`Pixel Event Fired: ${eventName}`, params);
        } else {
            console.warn('Facebook Pixel (fbq) not initialized.');
        }
    }

    // Helper function to track Google Analytics events
    function trackGAEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
            console.log(`GA Event Fired: ${eventName}`, params);
        } else {
            console.warn('Google Analytics (gtag) not initialized.');
        }
    }

    // 1. Track WhatsApp Clicks as 'Lead'
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function () {
            trackPixelEvent('Lead', {
                content_name: 'WhatsApp Click - Salon Demo',
                content_category: 'Demo Engagement',
                value: 0.00,
                currency: 'BWP'
            });
            trackGAEvent('whatsapp_click', {
                event_category: 'engagement',
                event_label: 'Salon Demo - WhatsApp'
            });
        });
    });

    // 2. Track AI Booking Button Click
    const tryAiBookingBtn = document.getElementById('tryAiBooking');
    if (tryAiBookingBtn) {
        tryAiBookingBtn.addEventListener('click', function () {
            trackPixelEvent('Schedule', {
                content_name: 'AI Booking Demo Started',
                content_category: 'Demo Interaction',
                content_type: 'ai_booking'
            });
            trackGAEvent('ai_booking_started', {
                event_category: 'engagement',
                event_label: 'Salon - AI Booking Demo'
            });
        });
    }

    // 3. Track Service Card Views
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            const serviceName = this.querySelector('.service-title')?.innerText || 'Unknown Service';
            const servicePrice = this.querySelector('.service-price strong')?.innerText || '';
            trackPixelEvent('ViewContent', {
                content_name: serviceName,
                content_category: 'Service Browse',
                content_type: 'service',
                value: parseFloat(servicePrice.replace(/[^0-9.]/g, '')) || 0,
                currency: 'BWP'
            });
            trackGAEvent('service_view', {
                event_category: 'engagement',
                event_label: `Service: ${serviceName}`
            });
        });
    });

    // 4. Track View All Services Click
    const viewAllServicesBtn = document.getElementById('viewAllServices');
    if (viewAllServicesBtn) {
        viewAllServicesBtn.addEventListener('click', function () {
            trackPixelEvent('ViewContent', {
                content_name: 'View All Services',
                content_category: 'Navigation',
                content_type: 'browse_all'
            });
        });
    }

    // 5. Track Modal Interactions
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.target.classList.contains('active')) {
                    trackPixelEvent('ViewContent', {
                        content_name: 'AI Booking Modal Opened',
                        content_category: 'Demo Interaction',
                        content_type: 'modal_view'
                    });
                    trackGAEvent('modal_opened', {
                        event_category: 'engagement',
                        event_label: 'AI Booking Modal'
                    });
                }
            });
        });
        observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
    }

    // 6. Track Scroll Depth (for engagement metrics)
    let scrollTracked = { quarter: false, half: false, threeQuarter: false, full: false };
    window.addEventListener('scroll', function () {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent >= 25 && !scrollTracked.quarter) {
            scrollTracked.quarter = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '25%' });
        }
        if (scrollPercent >= 50 && !scrollTracked.half) {
            scrollTracked.half = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '50%' });
        }
        if (scrollPercent >= 75 && !scrollTracked.threeQuarter) {
            scrollTracked.threeQuarter = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '75%' });
        }
        if (scrollPercent >= 95 && !scrollTracked.full) {
            scrollTracked.full = true;
            trackGAEvent('scroll_depth', { event_category: 'engagement', event_label: '100%' });
        }
    });

    // 7. Track Time on Page
    let timeOnPage = 0;
    const timeTracker = setInterval(function () {
        timeOnPage += 10;
        if (timeOnPage === 30) {
            trackGAEvent('time_on_page', { event_category: 'engagement', event_label: '30_seconds' });
        } else if (timeOnPage === 60) {
            trackGAEvent('time_on_page', { event_category: 'engagement', event_label: '60_seconds' });
            clearInterval(timeTracker);
        }
    }, 10000);

});
