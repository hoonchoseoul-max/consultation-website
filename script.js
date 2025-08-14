// FormaE AI 웹사이트 JavaScript

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수들 실행
    initScrollNavigation();
    initScrollIndicator();
    initIntersectionObserver();
    initCTAButtons();
    
    console.log('FormaE AI 웹사이트가 로드되었습니다.');
});

/**
 * FAQ 아코디언 토글 함수
 * @param {number} index - FAQ 항목의 인덱스
 */
function toggleFAQ(index) {
    const faqContent = document.querySelectorAll('.faq-content')[index];
    const faqIcon = document.querySelectorAll('.faq-icon')[index];
    const isActive = faqContent.classList.contains('active');
    
    // 모든 FAQ 닫기
    document.querySelectorAll('.faq-content').forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
    });
    
    // 모든 아이콘을 + 로 변경
    document.querySelectorAll('.faq-icon').forEach(icon => {
        icon.textContent = '+';
    });
    
    // 클릭한 FAQ가 닫혀있었다면 열기
    if (!isActive) {
        faqContent.classList.remove('hidden');
        faqContent.classList.add('active');
        faqIcon.textContent = '−';
        
        // 접근성을 위한 aria 속성 업데이트
        const button = faqContent.previousElementSibling;
        button.setAttribute('aria-expanded', 'true');
    } else {
        // 접근성을 위한 aria 속성 업데이트
        const button = faqContent.previousElementSibling;
        button.setAttribute('aria-expanded', 'false');
    }
}

/**
 * 스크롤 내비게이션 초기화
 */
function initScrollNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 내비게이션 바 높이를 고려한 오프셋
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일에서 메뉴가 열려있다면 닫기 (향후 햄버거 메뉴용)
                closeMobileMenu();
            }
        });
    });
}

/**
 * 스크롤 인디케이터 초기화
 */
function initScrollIndicator() {
    // 스크롤 인디케이터 요소 생성
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.prepend(scrollIndicator);
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', updateScrollIndicator);
}

/**
 * 스크롤 인디케이터 업데이트
 */
function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    scrollIndicator.style.width = scrolled + '%';
    
    // 내비게이션 바 스타일 변경 (스크롤 시)
    const nav = document.querySelector('nav');
    if (winScroll > 100) {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
}

/**
 * Intersection Observer로 애니메이션 효과 초기화
 */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // 활성 내비게이션 링크 업데이트
                updateActiveNavLink(entry.target.id);
            }
        });
    }, observerOptions);
    
    // 관찰할 섹션들
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 활성 내비게이션 링크 업데이트
 * @param {string} activeSectionId - 현재 활성 섹션의 ID
 */
function updateActiveNavLink(activeSectionId) {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.classList.remove('text-orange-500', 'font-semibold');
        link.classList.add('text-gray-700');
        
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.remove('text-gray-700');
            link.classList.add('text-orange-500', 'font-semibold');
        }
    });
}

/**
 * CTA 버튼들 이벤트 리스너 초기화
 */
function initCTAButtons() {
    // 상담 신청 링크 클릭 이벤트 (Google Analytics 추적용)
    const consultationLinks = document.querySelectorAll('a[href="consultation.html"]');
    consultationLinks.forEach(link => {
        link.addEventListener('click', handleConsultationLinkClick);
    });
    
    // 데모 요청 버튼 이벤트
    const demoButtons = document.querySelectorAll('button[onclick="handleDemoRequest()"]');
    demoButtons.forEach(button => {
        button.addEventListener('click', handleDemoRequest);
    });
    
    // 이메일 링크 클릭 이벤트
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', handleEmailClick);
    });
}

/**
 * 무료 상담 링크 클릭 처리 (Google Analytics 추적)
 */
function handleConsultationLinkClick() {
    // Google Analytics 이벤트 (실제 서비스에서 사용)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'CTA',
            event_label: 'consultation_page_visit'
        });
    }
    
    console.log('무료 상담 페이지로 이동');
}

/**
 * 데모 요청 처리
 */
function handleDemoRequest() {
    const email = 'contact@formaeai.org';
    const subject = '데모 요청';
    const body = '안녕하세요.%0A%0AAI 마케팅 솔루션 데모를 요청하고 싶습니다.%0A%0A회사명:%0A담당자명:%0A연락처:%0A희망 데모 일시:%0A%0A감사합니다.';
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    
    // Google Analytics 이벤트
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'CTA',
            event_label: 'demo_request'
        });
    }
}

/**
 * 이메일 클릭 처리
 */
function handleEmailClick() {
    // Google Analytics 이벤트
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Contact',
            event_label: 'email_click'
        });
    }
}

/**
 * 모바일 메뉴 닫기 (향후 햄버거 메뉴용)
 */
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

/**
 * 페이지 로딩 시 부드러운 애니메이션
 */
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

/**
 * 키보드 접근성 개선
 */
document.addEventListener('keydown', function(e) {
    // Escape 키로 열린 FAQ 닫기
    if (e.key === 'Escape') {
        const activeFAQ = document.querySelector('.faq-content.active');
        if (activeFAQ) {
            const index = Array.from(document.querySelectorAll('.faq-content')).indexOf(activeFAQ);
            toggleFAQ(index);
        }
    }
    
    // Tab 키 네비게이션 시각적 표시
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// 마우스 클릭 시 키보드 네비게이션 클래스 제거
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

/**
 * 성능 최적화: 스크롤 이벤트 throttling
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 이벤트에 throttling 적용
window.addEventListener('scroll', throttle(updateScrollIndicator, 16));

/**
 * 에러 처리
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러 발생:', e.error);
    // 실제 서비스에서는 에러 로깅 서비스로 전송
});

/**
 * 접근성: FAQ 버튼에 aria 속성 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    const faqButtons = document.querySelectorAll('.faq-button');
    faqButtons.forEach((button, index) => {
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `faq-content-${index}`);
        
        const content = button.nextElementSibling;
        content.setAttribute('id', `faq-content-${index}`);
        content.setAttribute('role', 'region');
    });
});