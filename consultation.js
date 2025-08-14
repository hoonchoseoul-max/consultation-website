// 무료 상담 신청 폼 JavaScript

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 폼과 주요 요소들 가져오기
    const form = document.getElementById('consultationForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');
    const successMessage = document.getElementById('successMessage');
    
    // 입력 필드들
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const companyInput = document.getElementById('company');
    const phoneInput = document.getElementById('phone');
    const privacyCheckbox = document.getElementById('privacy');
    
    console.log('무료 상담 신청 폼이 로드되었습니다.');
    
    // 실시간 유효성 검증 이벤트 리스너 추가
    nameInput.addEventListener('blur', () => validateField('name'));
    emailInput.addEventListener('blur', () => validateField('email'));
    companyInput.addEventListener('blur', () => validateField('company'));
    phoneInput.addEventListener('blur', () => validateField('phone'));
    privacyCheckbox.addEventListener('change', () => validateField('privacy'));
    
    // 전화번호 자동 포맷팅
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // 폼 제출 이벤트 처리
    form.addEventListener('submit', handleFormSubmit);
});

/**
 * 개별 필드 유효성 검증
 * @param {string} fieldName - 검증할 필드명
 * @returns {boolean} - 유효성 검증 결과
 */
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let errorMessage = '';
    
    // 필드별 검증 로직
    switch (fieldName) {
        case 'name':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = '성명을 입력해주세요.';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = '성명은 2글자 이상 입력해주세요.';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = '이메일을 입력해주세요.';
            } else if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = '올바른 이메일 형식을 입력해주세요.';
            }
            break;
            
        case 'company':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = '소속을 입력해주세요.';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = '전화번호를 입력해주세요.';
            } else if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorMessage = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
            }
            break;
            
        case 'privacy':
            if (!field.checked) {
                isValid = false;
                errorMessage = '개인정보 처리 동의가 필요합니다.';
            }
            break;
    }
    
    // UI 업데이트
    if (isValid) {
        field.classList.remove('error');
        errorElement.classList.remove('show');
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    }
    
    return isValid;
}

/**
 * 전체 폼 유효성 검증
 * @returns {boolean} - 전체 폼 유효성 검증 결과
 */
function validateForm() {
    const fields = ['name', 'email', 'company', 'phone', 'privacy'];
    let isFormValid = true;
    
    // 모든 필드 검증
    fields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

/**
 * 전화번호 자동 포맷팅 (010-1234-5678 형식)
 * @param {Event} e - input 이벤트
 */
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
    
    if (value.length >= 11) {
        value = value.slice(0, 11); // 11자리까지만
    }
    
    // 포맷팅 적용
    if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    }
    
    e.target.value = value;
}

/**
 * 폼 제출 처리
 * @param {Event} e - submit 이벤트
 */
async function handleFormSubmit(e) {
    e.preventDefault(); // 기본 제출 동작 방지
    
    // 폼 유효성 검증
    if (!validateForm()) {
        // 첫 번째 에러 필드로 스크롤
        const firstError = document.querySelector('.form-input.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            firstError.focus();
        }
        return;
    }
    
    // 로딩 상태 시작
    setLoadingState(true);
    
    try {
        // 폼 데이터 수집
        const formData = getFormData();
        
        // 실제 서비스에서는 서버로 데이터 전송
        // 현재는 시뮬레이션
        await simulateFormSubmission(formData);
        
        // 성공 처리
        showSuccessMessage();
        form.reset(); // 폼 초기화
        
        // Google Analytics 이벤트 (실제 서비스에서 사용)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Consultation',
                event_label: 'consultation_request'
            });
        }
        
    } catch (error) {
        console.error('폼 제출 중 오류 발생:', error);
        alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        // 로딩 상태 종료
        setLoadingState(false);
    }
}

/**
 * 폼 데이터 수집
 * @returns {Object} - 폼 데이터 객체
 */
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        interest: document.getElementById('interest').value,
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString()
    };
}

/**
 * 폼 제출 시뮬레이션 (실제 서비스에서는 서버 API 호출)
 * @param {Object} formData - 폼 데이터
 */
async function simulateFormSubmission(formData) {
    // 로딩 시뮬레이션 (2초)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 이메일 전송 시뮬레이션 (실제로는 이메일 서비스 API 사용)
    const emailSubject = encodeURIComponent('무료 상담 신청 - ' + formData.name);
    const emailBody = encodeURIComponent(createEmailBody(formData));
    
    // 관리자 이메일로 내용 전송 (실제 구현에서는 백엔드에서 처리)
    console.log('이메일 전송 정보:', {
        to: 'contact@formaeai.org',
        subject: emailSubject,
        body: emailBody
    });
    
    // 실제 환경에서는 여기서 fetch API로 서버에 데이터 전송
    /*
    const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.');
    }
    */
}

/**
 * 이메일 본문 생성
 * @param {Object} formData - 폼 데이터
 * @returns {string} - 이메일 본문
 */
function createEmailBody(formData) {
    return `
무료 상담 신청이 접수되었습니다.

=== 신청자 정보 ===
성명: ${formData.name}
이메일: ${formData.email}
소속: ${formData.company}
연락처: ${formData.phone}
관심분야: ${getInterestText(formData.interest)}

=== 문의사항 ===
${formData.message || '없음'}

=== 신청 정보 ===
신청시간: ${new Date(formData.timestamp).toLocaleString('ko-KR')}

---
FormaE AI 자동 시스템
    `.trim();
}

/**
 * 관심분야 코드를 텍스트로 변환
 * @param {string} interestCode - 관심분야 코드
 * @returns {string} - 관심분야 텍스트
 */
function getInterestText(interestCode) {
    const interestMap = {
        'sns-marketing': 'SNS 마케팅 자동화',
        'cost-reduction': '마케팅 비용 절감',
        'ai-analysis': 'AI 데이터 분석',
        'campaign-optimization': '캠페인 최적화',
        'comprehensive': '종합 솔루션',
        'other': '기타'
    };
    
    return interestMap[interestCode] || '선택하지 않음';
}

/**
 * 로딩 상태 설정
 * @param {boolean} isLoading - 로딩 상태
 */
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        submitText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
}

/**
 * 성공 메시지 표시
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // 성공 메시지로 스크롤
    successMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // 5초 후 메시지 숨기기
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

/**
 * 키보드 접근성 개선
 */
document.addEventListener('keydown', function(e) {
    // Enter 키로 체크박스 토글
    if (e.key === 'Enter' && e.target.type === 'checkbox') {
        e.target.checked = !e.target.checked;
        validateField(e.target.name);
    }
});

/**
 * 폼 필드 애니메이션 효과
 */
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        // 포커스 시 라벨 애니메이션 (향후 확장 가능)
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

/**
 * 에러 처리
 */
window.addEventListener('error', function(e) {
    console.error('상담 신청 폼 에러:', e.error);
    // 실제 서비스에서는 에러 로깅 서비스로 전송
});

/**
 * 페이지 이탈 시 경고 (폼 작성 중인 경우)
 */
let formModified = false;

document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('#consultationForm input, #consultationForm select, #consultationForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            formModified = true;
        });
    });
});

window.addEventListener('beforeunload', function(e) {
    if (formModified) {
        const message = '작성 중인 내용이 있습니다. 정말 페이지를 떠나시겠습니까?';
        e.returnValue = message;
        return message;
    }
});

// 폼 제출 후에는 경고 해제
document.getElementById('consultationForm').addEventListener('submit', function() {
    formModified = false;
});