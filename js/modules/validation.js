// Модуль валидации
const Validation = {
    // Валидация поля
    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + 'Error');

        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'customerName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                }
                break;
            case 'customerEmail':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите корректный email';
                }
                break;
            case 'customerPhone':
                if (!/^[\d\s\-\+\(\)]+$/.test(value) || value.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    errorMessage = 'Введите корректный номер телефона';
                }
                break;
            case 'customerOrganization':
                // Организация не обязательна, только базовая валидация
                if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'Название организации слишком длинное';
                }
                break;
            case 'customerAddress':
                if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Адрес должен содержать минимум 5 символов';
                }
                break;
        }

        if (!isValid && fieldId !== 'customerOrganization') {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        return isValid;
    },

    // Валидация всей формы
    validateForm() {
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'customerAddress'];
        const optionalFields = ['customerOrganization'];
        let isValid = true;
        
        // Валидация обязательных полей
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Валидация необязательных полей (только если заполнены)
        optionalFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim() !== '') {
                this.validateField(field);
            }
        });
        
        return isValid;
    },

    // Очистка ошибки поля
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    },

    // Настройка валидации
    init() {
        const inputs = document.querySelectorAll('#checkoutModal input');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
    }
};