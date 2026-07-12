// Doctors page JavaScript

let doctors = [];
let filteredDoctors = [];
let userLocation = null;

// Mock doctor data
const mockDoctors = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        rating: 4.9,
        reviewCount: 127,
        distance: 0.8,
        price: 150,
        availability: 'Available Today',
        location: '123 Medical Center Dr',
        phone: '+1 (555) 123-4567',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        experience: '15 years',
        languages: ['English', 'Spanish'],
        insurance: ['Blue Cross', 'Aetna', 'Cigna']
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Dermatology',
        rating: 4.8,
        reviewCount: 89,
        distance: 1.2,
        price: 120,
        availability: 'Available Tomorrow',
        location: '456 Health Plaza',
        phone: '+1 (555) 234-5678',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        experience: '12 years',
        languages: ['English', 'Mandarin'],
        insurance: ['Blue Cross', 'UnitedHealth']
    },
    {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        rating: 4.9,
        reviewCount: 203,
        distance: 0.5,
        price: 100,
        availability: 'Available Today',
        location: '789 Children\'s Hospital',
        phone: '+1 (555) 345-6789',
        image: 'https://images.unsplash.com/photo-1594824388852-7c59a4932a7a?w=150&h=150&fit=crop&crop=face',
        experience: '18 years',
        languages: ['English', 'Spanish'],
        insurance: ['Blue Cross', 'Aetna', 'Medicaid']
    },
    {
        id: 4,
        name: 'Dr. David Kim',
        specialty: 'Neurology',
        rating: 4.7,
        reviewCount: 156,
        distance: 2.1,
        price: 200,
        availability: 'Available Next Week',
        location: '321 Neurology Center',
        phone: '+1 (555) 456-7890',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        experience: '20 years',
        languages: ['English', 'Korean'],
        insurance: ['Blue Cross', 'Cigna', 'UnitedHealth']
    },
    {
        id: 5,
        name: 'Dr. Lisa Thompson',
        specialty: 'Orthopedics',
        rating: 4.8,
        reviewCount: 94,
        distance: 1.8,
        price: 180,
        availability: 'Available Tomorrow',
        location: '654 Sports Medicine',
        phone: '+1 (555) 567-8901',
        image: 'https://images.unsplash.com/photo-1594824388852-7c59a4932a7a?w=150&h=150&fit=crop&crop=face',
        experience: '14 years',
        languages: ['English'],
        insurance: ['Blue Cross', 'Aetna']
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

function initializePage() {
    // Show loading state
    showLoading();
    
    // Simulate loading doctors and getting location
    setTimeout(() => {
        loadDoctors();
        getCurrentLocation();
        hideLoading();
    }, 1500);
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const sortFilter = document.getElementById('sortFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const distanceFilter = document.getElementById('distanceFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterDoctors);
    }
    
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', filterDoctors);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortDoctors);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterDoctors);
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', filterDoctors);
    }
    
    if (distanceFilter) {
        distanceFilter.addEventListener('change', filterDoctors);
    }
}

function loadDoctors() {
    doctors = [...mockDoctors];
    filteredDoctors = [...doctors];
    renderDoctors();
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: 'Current Location'
                };
                updateLocationDisplay();
            },
            (error) => {
                console.error('Error getting location:', error);
                userLocation = {
                    lat: 40.7128,
                    lng: -74.0060,
                    address: 'New York, NY (Default)'
                };
                updateLocationDisplay();
            }
        );
    } else {
        userLocation = {
            lat: 40.7128,
            lng: -74.0060,
            address: 'New York, NY (Default)'
        };
        updateLocationDisplay();
    }
}

function updateLocation() {
    MedTechUtils.showNotification('Updating location...', 'info');
    getCurrentLocation();
}

function updateLocationDisplay() {
    const locationAddress = document.getElementById('locationAddress');
    const locationCount = document.getElementById('locationCount');
    
    if (locationAddress) {
        locationAddress.textContent = userLocation.address;
    }
    
    if (locationCount) {
        locationCount.textContent = `${filteredDoctors.length} doctors found`;
    }
}

function filterDoctors() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const specialty = document.getElementById('specialtyFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const rating = document.getElementById('ratingFilter').value;
    const distance = document.getElementById('distanceFilter').value;
    
    filteredDoctors = doctors.filter(doctor => {
        // Search term filter
        if (searchTerm && !doctor.name.toLowerCase().includes(searchTerm) &&
            !doctor.specialty.toLowerCase().includes(searchTerm) &&
            !doctor.location.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Specialty filter
        if (specialty !== 'all' && doctor.specialty.toLowerCase() !== specialty) {
            return false;
        }
        
        // Price filter
        if (priceRange !== 'all') {
            switch (priceRange) {
                case 'under-100':
                    if (doctor.price >= 100) return false;
                    break;
                case '100-150':
                    if (doctor.price < 100 || doctor.price > 150) return false;
                    break;
                case '150-200':
                    if (doctor.price < 150 || doctor.price > 200) return false;
                    break;
                case 'over-200':
                    if (doctor.price <= 200) return false;
                    break;
            }
        }
        
        // Rating filter
        if (rating !== 'all') {
            const minRating = parseFloat(rating.replace('+', ''));
            if (doctor.rating < minRating) return false;
        }
        
        // Distance filter
        if (distance !== 'all') {
            const maxDistance = parseFloat(distance);
            if (doctor.distance > maxDistance) return false;
        }
        
        return true;
    });
    
    updateLocationDisplay();
    renderDoctors();
}

function sortDoctors() {
    const sortBy = document.getElementById('sortFilter').value;
    
    filteredDoctors.sort((a, b) => {
        switch (sortBy) {
            case 'distance':
                return a.distance - b.distance;
            case 'rating':
                return b.rating - a.rating;
            case 'price':
                return a.price - b.price;
            case 'availability':
                const availabilityOrder = { 'Available Today': 1, 'Available Tomorrow': 2, 'Available Next Week': 3 };
                return availabilityOrder[a.availability] - availabilityOrder[b.availability];
            default:
                return 0;
        }
    });
    
    renderDoctors();
}

function renderDoctors() {
    const doctorsList = document.getElementById('doctorsList');
    const noResults = document.getElementById('noResults');
    
    if (filteredDoctors.length === 0) {
        doctorsList.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    doctorsList.style.display = 'block';
    noResults.style.display = 'none';
    
    doctorsList.innerHTML = '';
    
    filteredDoctors.forEach((doctor, index) => {
        const doctorElement = createDoctorElement(doctor, index);
        doctorsList.appendChild(doctorElement);
    });
}

function createDoctorElement(doctor, index) {
    const doctorDiv = document.createElement('div');
    doctorDiv.className = 'doctor-card';
    doctorDiv.style.animationDelay = `${index * 0.1}s`;
    
    const availabilityClass = getAvailabilityClass(doctor.availability);
    
    doctorDiv.innerHTML = `
        <div class="doctor-content">
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <div class="doctor-header">
                    <div class="doctor-basic-info">
                        <h3>${doctor.name}</h3>
                        <div class="doctor-specialty">${doctor.specialty}</div>
                        <div class="doctor-stats">
                            <div class="doctor-stat">
                                <i class="fas fa-star"></i>
                                <span>${doctor.rating} (${doctor.reviewCount} reviews)</span>
                            </div>
                            <div class="doctor-stat">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${doctor.distance} miles</span>
                            </div>
                            <div class="doctor-stat">
                                <i class="fas fa-award"></i>
                                <span>${doctor.experience}</span>
                            </div>
                        </div>
                        <div class="doctor-availability ${availabilityClass}">
                            <i class="fas fa-clock"></i>
                            <span>${doctor.availability}</span>
                        </div>
                    </div>
                    <div class="doctor-price">
                        $${doctor.price}
                        <span>/visit</span>
                    </div>
                </div>
                
                <div class="doctor-details">
                    <div class="doctor-detail">
                        <strong>Location:</strong>
                        <span>${doctor.location}</span>
                    </div>
                    <div class="doctor-detail">
                        <strong>Phone:</strong>
                        <span>${doctor.phone}</span>
                    </div>
                    <div class="doctor-detail">
                        <strong>Languages:</strong>
                        <span>${doctor.languages.join(', ')}</span>
                    </div>
                    <div class="doctor-detail">
                        <strong>Insurance:</strong>
                        <div class="insurance-tags">
                            ${doctor.insurance.map(ins => `<span class="insurance-tag">${ins}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="doctor-actions">
                    <button class="doctor-action-btn book-appointment" onclick="bookAppointment(${doctor.id})">
                        <i class="fas fa-calendar"></i>
                        Book Appointment
                    </button>
                    <button class="doctor-action-btn call-now" onclick="callDoctor('${doctor.phone}')">
                        <i class="fas fa-phone"></i>
                        Call Now
                    </button>
                    <button class="doctor-action-btn get-directions" onclick="getDirections('${doctor.location}')">
                        <i class="fas fa-directions"></i>
                        Directions
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return doctorDiv;
}

function getAvailabilityClass(availability) {
    switch (availability) {
        case 'Available Today':
            return 'availability-today';
        case 'Available Tomorrow':
            return 'availability-tomorrow';
        case 'Available Next Week':
            return 'availability-next-week';
        default:
            return '';
    }
}

function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advancedFilters');
    const filtersIcon = document.getElementById('filtersIcon');
    const filtersBtn = document.querySelector('.filters-toggle-btn');
    
    if (advancedFilters.style.display === 'none') {
        advancedFilters.style.display = 'block';
        filtersIcon.style.transform = 'rotate(180deg)';
        filtersBtn.classList.add('active');
    } else {
        advancedFilters.style.display = 'none';
        filtersIcon.style.transform = 'rotate(0deg)';
        filtersBtn.classList.remove('active');
    }
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('specialtyFilter').value = 'all';
    document.getElementById('sortFilter').value = 'distance';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('ratingFilter').value = 'all';
    document.getElementById('distanceFilter').value = 'all';
    
    filteredDoctors = [...doctors];
    updateLocationDisplay();
    renderDoctors();
    
    MedTechUtils.showNotification('All filters cleared', 'success');
}

function bookAppointment(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    MedTechUtils.showNotification(`Booking appointment with ${doctor.name}...`, 'info');
    
    // Simulate booking process
    setTimeout(() => {
        MedTechUtils.showNotification('Appointment booking would be implemented here', 'info');
    }, 1500);
}

function callDoctor(phone) {
    MedTechUtils.showNotification(`Calling ${phone}...`, 'info');
    
    // In a real app, this would initiate a phone call
    setTimeout(() => {
        MedTechUtils.showNotification('Phone call functionality would be implemented here', 'info');
    }, 1000);
}

function getDirections(location) {
    MedTechUtils.showNotification(`Getting directions to ${location}...`, 'info');
    
    // In a real app, this would open maps
    setTimeout(() => {
        MedTechUtils.showNotification('Directions functionality would be implemented here', 'info');
    }, 1000);
}

function showLoading() {
    const loadingState = document.getElementById('loadingState');
    const doctorsList = document.getElementById('doctorsList');
    
    if (loadingState) loadingState.style.display = 'block';
    if (doctorsList) doctorsList.style.display = 'none';
}

function hideLoading() {
    const loadingState = document.getElementById('loadingState');
    
    if (loadingState) loadingState.style.display = 'none';
}
