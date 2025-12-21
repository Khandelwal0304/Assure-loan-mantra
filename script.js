// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Accordion functionality
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                animateValue(statNumber);
                statNumber.classList.add('animated');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-item').forEach(item => {
    observer.observe(item);
});

function animateValue(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d.]/g, '');
    const duration = 2000;
    const start = 0;
    const increment = number / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = text;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Add hover effects to cards
document.querySelectorAll('.loan-card, .insurance-card, .bill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();
    });
}

// EMI Calculator Functionality
let emiChart = null;

function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value) || 0;
    const rate = parseFloat(document.getElementById('interestRate').value) || 0;
    const tenure = parseFloat(document.getElementById('loanTenure').value) || 0;
    
    if (principal <= 0 || rate <= 0 || tenure <= 0) {
        showNotification('Please enter valid values for all fields', 'error');
        return;
    }
    
    const monthlyRate = rate / 12 / 100;
    const numberOfMonths = tenure * 12;
    
    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / 
                (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    
    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - principal;
    
    // Update results
    document.getElementById('monthlyEMI').textContent = formatCurrency(emi);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalPayments').textContent = `${numberOfMonths} Months`;
    
    // Draw chart
    drawEMIChart(principal, totalInterest);
    
    showNotification('EMI calculated successfully!', 'success');
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function resetCalculator() {
    document.getElementById('loanAmount').value = 1000000;
    document.getElementById('loanAmountRange').value = 1000000;
    document.getElementById('interestRate').value = 10;
    document.getElementById('interestRateRange').value = 10;
    document.getElementById('loanTenure').value = 5;
    document.getElementById('loanTenureRange').value = 5;
    
    document.getElementById('monthlyEMI').textContent = '₹0';
    document.getElementById('totalAmount').textContent = '₹0';
    document.getElementById('totalInterest').textContent = '₹0';
    document.getElementById('totalPayments').textContent = '0 Months';
    
    if (emiChart) {
        emiChart.destroy();
        emiChart = null;
    }
    
    showNotification('Calculator reset', 'info');
}

function drawEMIChart(principal, interest) {
    const ctx = document.getElementById('emiChart');
    if (!ctx) return;
    
    if (emiChart) {
        emiChart.destroy();
    }
    
    emiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#1a237e', '#4caf50'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatCurrency(context.parsed);
                        }
                    }
                }
            }
        }
    });
}

// Sync range sliders with number inputs
document.addEventListener('DOMContentLoaded', function() {
    // Loan Amount
    const loanAmount = document.getElementById('loanAmount');
    const loanAmountRange = document.getElementById('loanAmountRange');
    if (loanAmount && loanAmountRange) {
        loanAmount.addEventListener('input', function() {
            loanAmountRange.value = this.value;
        });
        loanAmountRange.addEventListener('input', function() {
            loanAmount.value = this.value;
        });
    }
    
    // Interest Rate
    const interestRate = document.getElementById('interestRate');
    const interestRateRange = document.getElementById('interestRateRange');
    if (interestRate && interestRateRange) {
        interestRate.addEventListener('input', function() {
            interestRateRange.value = this.value;
        });
        interestRateRange.addEventListener('input', function() {
            interestRate.value = this.value;
        });
    }
    
    // Loan Tenure
    const loanTenure = document.getElementById('loanTenure');
    const loanTenureRange = document.getElementById('loanTenureRange');
    if (loanTenure && loanTenureRange) {
        loanTenure.addEventListener('input', function() {
            loanTenureRange.value = this.value;
        });
        loanTenureRange.addEventListener('input', function() {
            loanTenure.value = this.value;
        });
    }
    
    // EMI Calculator Form
    const emiCalculatorForm = document.getElementById('emiCalculatorForm');
    if (emiCalculatorForm) {
        emiCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateEMI();
        });
    }
});

// All Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sign In Button
    const signInBtn = document.querySelector('.btn-signin');
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            showLoginModal();
        });
    }
    
    // Secure Login Button
    const secureLoginBtn = document.querySelector('.hero .btn-primary');
    if (secureLoginBtn) {
        secureLoginBtn.addEventListener('click', function() {
            showLoginModal();
        });
    }
    
    // Get Started Button
    const getStartedBtn = document.querySelector('.hero .btn-secondary');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            document.querySelector('#loans').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Apply Now Buttons (Loan Cards)
    document.querySelectorAll('.btn-card').forEach(btn => {
        btn.addEventListener('click', function() {
            const loanCard = this.closest('.loan-card');
            const loanType = loanCard.querySelector('h3').textContent;
            showLoanApplicationModal(loanType);
        });
    });
    
    // Insurance Cards
    document.querySelectorAll('.insurance-card').forEach(card => {
        card.addEventListener('click', function() {
            const insuranceType = this.querySelector('h3').textContent;
            showNotification(`Redirecting to ${insuranceType} page...`, 'info');
            // In real app, would redirect to insurance page
        });
    });
    
    // Bill Cards
    document.querySelectorAll('.bill-card').forEach(card => {
        card.addEventListener('click', function() {
            const billType = this.querySelector('h3').textContent;
            showBillPaymentModal(billType);
        });
    });
    
    // App Download Buttons
    document.querySelectorAll('.app-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('strong').textContent;
            showNotification(`Redirecting to ${platform}...`, 'info');
        });
    });
});

// Modal Functions
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Secure Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-lock"></i> Password</label>
                    <input type="password" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn-primary">Login</button>
                <p style="text-align: center; margin-top: 1rem;">
                    <a href="#" style="color: var(--primary-color);">Forgot Password?</a>
                </p>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Login successful!', 'success');
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showLoanApplicationModal(loanType) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Apply for ${loanType}</h2>
            <form id="loanApplicationForm">
                <div class="form-group">
                    <label><i class="fas fa-rupee-sign"></i> Loan Amount</label>
                    <input type="number" placeholder="Enter loan amount" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Full Name</label>
                    <input type="text" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-phone"></i> Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-briefcase"></i> Employment Type</label>
                    <select required>
                        <option value="">Select employment type</option>
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self Employed</option>
                        <option value="business">Business</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Submit Application</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#loanApplicationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification(`${loanType} application submitted successfully! Our team will contact you soon.`, 'success');
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showBillPaymentModal(billType) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Pay ${billType}</h2>
            <form id="billPaymentForm">
                <div class="form-group">
                    <label><i class="fas fa-id-card"></i> Account/Customer ID</label>
                    <input type="text" placeholder="Enter account or customer ID" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-rupee-sign"></i> Amount</label>
                    <input type="number" placeholder="Enter amount" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-mobile-alt"></i> Mobile Number</label>
                    <input type="tel" placeholder="Enter mobile number" required>
                </div>
                <button type="submit" class="btn-primary">Pay Now</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#billPaymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification(`${billType} payment successful!`, 'success');
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Quick Apply Form Handler
const quickApplyForm = document.getElementById('quickApplyForm');
if (quickApplyForm) {
    quickApplyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Generate unique lead ID
        const leadId = 'ALM' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Show OTP modal
        showOTPModal(data.mobile, function() {
            // After OTP verification, submit the form
            submitLoanApplication(data, leadId, 'quick-apply');
        });
    });
}

// CIBIL Check Form Handler
const cibilCheckForm = document.getElementById('cibilCheckForm');
if (cibilCheckForm) {
    cibilCheckForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate PAN format
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
            showNotification('Please enter a valid PAN card number', 'error');
            return;
        }
        
        // Show OTP modal
        showOTPModal(data.mobile, function() {
            // After OTP verification, fetch CIBIL score
            fetchCIBILScore(data);
        });
    });
}

// OTP Modal Functions
let otpTimerInterval;
let otpResendTimer = 60;

function showOTPModal(mobile, callback) {
    const modal = document.getElementById('otpModal');
    if (!modal) return;
    
    document.getElementById('mobileNumberDisplay').textContent = mobile;
    modal.style.display = 'flex';
    
    // Start OTP timer
    otpResendTimer = 60;
    startOTPTimer();
    
    // Auto-focus first OTP input
    document.getElementById('otp1').focus();
    
    // Handle OTP input auto-move
    const otpInputs = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
    otpInputs.forEach((id, index) => {
        const input = document.getElementById(id);
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < 5) {
                document.getElementById(otpInputs[index + 1]).focus();
            }
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                document.getElementById(otpInputs[index - 1]).focus();
            }
        });
    });
    
    // Handle OTP form submission
    const otpForm = document.getElementById('otpForm');
    otpForm.onsubmit = function(e) {
        e.preventDefault();
        const otp = otpInputs.map(id => document.getElementById(id).value).join('');
        
        if (otp.length === 6) {
            // Verify OTP (in real app, this would call backend API)
            verifyOTP(otp, mobile, callback);
        } else {
            showNotification('Please enter complete 6-digit OTP', 'error');
        }
    };
}

function closeOTPModal() {
    const modal = document.getElementById('otpModal');
    if (modal) {
        modal.style.display = 'none';
        clearInterval(otpTimerInterval);
        // Clear OTP inputs
        ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'].forEach(id => {
            document.getElementById(id).value = '';
        });
    }
}

function startOTPTimer() {
    const timerElement = document.getElementById('otpTimer');
    if (!timerElement) return;
    
    timerElement.textContent = ` (Resend in ${otpResendTimer}s)`;
    
    otpTimerInterval = setInterval(() => {
        otpResendTimer--;
        if (otpResendTimer > 0) {
            timerElement.textContent = ` (Resend in ${otpResendTimer}s)`;
        } else {
            timerElement.textContent = '';
            clearInterval(otpTimerInterval);
        }
    }, 1000);
}

function resendOTP() {
    if (otpResendTimer > 0) return;
    
    // In real app, call backend to resend OTP
    showNotification('OTP resent successfully', 'success');
    otpResendTimer = 60;
    startOTPTimer();
}

function verifyOTP(otp, mobile, callback) {
    // In real app, this would verify OTP with backend
    // For demo, accept any 6-digit OTP
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        showNotification('OTP verified successfully', 'success');
        closeOTPModal();
        if (callback) callback();
    } else {
        showNotification('Invalid OTP. Please try again.', 'error');
    }
}

// CIBIL Score Fetching
function fetchCIBILScore(data) {
    showNotification('Fetching your CIBIL score...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // Generate random score between 300-900
        const score = Math.floor(Math.random() * 600) + 300;
        const status = getScoreStatus(score);
        const analysis = getScoreAnalysis(score);
        const recommendations = getLoanRecommendations(score);
        
        showCIBILScoreResult(score, status, analysis, recommendations);
    }, 2000);
}

function getScoreStatus(score) {
    if (score >= 750) return { text: 'Excellent', color: '#4caf50' };
    if (score >= 700) return { text: 'Good', color: '#2196f3' };
    if (score >= 650) return { text: 'Average', color: '#ffc107' };
    return { text: 'Needs Improvement', color: '#f44336' };
}

function getScoreAnalysis(score) {
    if (score >= 750) {
        return 'Your credit score is excellent! You are eligible for the best interest rates and highest loan amounts from all lenders.';
    } else if (score >= 700) {
        return 'Your credit score is good. You can get competitive interest rates from most lenders. Consider improving your score further for better deals.';
    } else if (score >= 650) {
        return 'Your credit score is average. You may get loans but at slightly higher interest rates. Focus on timely payments to improve your score.';
    } else {
        return 'Your credit score needs improvement. Pay your bills on time, reduce credit utilization, and avoid multiple loan applications to improve your score.';
    }
}

function getLoanRecommendations(score) {
    const recommendations = [];
    
    if (score >= 700) {
        recommendations.push({ name: 'Personal Loan', rate: '10.5% - 15%', eligible: true });
        recommendations.push({ name: 'Home Loan', rate: '8.5% - 10%', eligible: true });
        recommendations.push({ name: 'Business Loan', rate: '9.5% - 12%', eligible: true });
    } else if (score >= 650) {
        recommendations.push({ name: 'Personal Loan', rate: '15% - 20%', eligible: true });
        recommendations.push({ name: 'Home Loan', rate: '10% - 12%', eligible: true });
        recommendations.push({ name: 'Business Loan', rate: '12% - 16%', eligible: true });
    } else {
        recommendations.push({ name: 'Personal Loan', rate: '20% - 24%', eligible: false });
        recommendations.push({ name: 'Secured Loans', rate: '12% - 18%', eligible: true });
    }
    
    return recommendations;
}

function showCIBILScoreResult(score, status, analysis, recommendations) {
    const modal = document.getElementById('scoreResultModal');
    if (!modal) return;
    
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('scoreStatus').textContent = status.text;
    document.getElementById('scoreStatus').style.color = status.color;
    document.getElementById('scoreAnalysis').textContent = analysis;
    
    // Update score circle
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.style.borderColor = status.color;
    scoreCircle.style.color = status.color;
    
    // Display recommendations
    const recommendationsGrid = document.getElementById('loanRecommendations');
    recommendationsGrid.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <h4>${rec.name}</h4>
            <p>${rec.rate} p.a.</p>
            ${rec.eligible ? '<span style="color: var(--accent-1);">✓ Eligible</span>' : '<span style="color: #f44336;">Not Eligible</span>'}
        </div>
    `).join('');
    
    modal.style.display = 'flex';
}

function closeScoreModal() {
    const modal = document.getElementById('scoreResultModal');
    if (modal) modal.style.display = 'none';
}

function downloadReport() {
    showNotification('Credit report download will be available after backend integration', 'info');
}

// Partner Registration Form
const partnerRegistrationForm = document.getElementById('partnerRegistrationForm');
if (partnerRegistrationForm) {
    partnerRegistrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show OTP modal
        showOTPModal(data.mobile, function() {
            // After OTP verification, submit partner registration
            submitPartnerRegistration(data);
        });
    });
}

function submitPartnerRegistration(data) {
    // Generate partner ID
    const partnerId = 'PART' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // In real app, submit to backend
    showNotification('Partner registration submitted successfully! Our team will contact you within 24 hours.', 'success');
    
    // Reset form
    document.getElementById('partnerRegistrationForm').reset();
}

// Personal Loan Application Form
const personalLoanForm = document.getElementById('personalLoanForm');
if (personalLoanForm) {
    // Handle employment type change
    const employmentType = document.getElementById('employmentType');
    if (employmentType) {
        employmentType.addEventListener('change', function() {
            const salariedFields = document.getElementById('salariedFields');
            const selfEmployedFields = document.getElementById('selfEmployedFields');
            
            if (this.value === 'salaried') {
                salariedFields.style.display = 'block';
                selfEmployedFields.style.display = 'none';
            } else if (this.value === 'self-employed') {
                salariedFields.style.display = 'none';
                selfEmployedFields.style.display = 'block';
            } else {
                salariedFields.style.display = 'none';
                selfEmployedFields.style.display = 'none';
            }
        });
    }
    
    personalLoanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Generate lead ID
        const leadId = 'ALM' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Show OTP modal
        showOTPModal(data.mobile, function() {
            // After OTP verification, submit loan application
            submitLoanApplication(data, leadId, 'personal-loan');
        });
    });
}

function submitLoanApplication(data, leadId, source) {
    // In real app, submit to backend API
    // Store lead with status: 'new'
    // Auto-match with eligible lenders
    // Notify sales team
    
    showNotification(`Application submitted successfully! Your Lead ID: ${leadId}. Our team will contact you within 24 hours.`, 'success');
    
    // Reset form if exists
    const form = document.querySelector('form');
    if (form) form.reset();
    
    // In real app, redirect to application tracking page
    // window.location.href = `application-status.html?leadId=${leadId}`;
}

// Document Tabs
function showDocuments(type) {
    const salariedDocs = document.getElementById('salariedDocs');
    const selfEmployedDocs = document.getElementById('selfEmployedDocs');
    const tabs = document.querySelectorAll('.doc-tab');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (type === 'salaried') {
        salariedDocs.style.display = 'block';
        selfEmployedDocs.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        salariedDocs.style.display = 'none';
        selfEmployedDocs.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// Eligibility Calculator (can be called from any page)
function calculateEligibility(income, employmentType, creditScore, city, loanAmount) {
    let eligibleAmount = 0;
    let eligible = false;
    
    if (employmentType === 'salaried') {
        // Typically 10-20 times monthly salary
        eligibleAmount = income * 15; // Conservative estimate
    } else {
        // For self-employed, typically 1-2 times annual income
        eligibleAmount = income * 1.5;
    }
    
    // Adjust based on credit score
    if (creditScore >= 750) {
        eligibleAmount *= 1.2;
    } else if (creditScore < 650) {
        eligibleAmount *= 0.7;
    }
    
    // Check if requested amount is within eligible range
    eligible = loanAmount <= eligibleAmount;
    
    return {
        eligible,
        eligibleAmount: Math.round(eligibleAmount),
        requestedAmount: loanAmount
    };
}

// Close modals on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

