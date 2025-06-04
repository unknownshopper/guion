document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('form-success');

    // Validación en tiempo real
    form.addEventListener('input', function(event) {
        validateField(event.target);
    });

    // Validación al enviar el formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        const formElements = form.elements;
        
        // Validar todos los campos
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (!validateField(element)) {
                    isValid = false;
                }
            }
        }

        // Si el formulario es válido, mostramos el mensaje de éxito
        if (isValid) {
            form.reset();
            formSuccess.style.display = 'block';
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });

    // Función para validar un campo individual
    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        
        // Reiniciar mensajes de error
        field.classList.remove('invalid');
        if (errorElement) {
            errorElement.textContent = '';
        }

        // Validar campo requerido
        if (field.required && !field.value.trim()) {
            showError(field, errorElement, 'Este campo es obligatorio');
            return false;
        }

        // Validaciones específicas por tipo de campo
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            if (!emailRegex.test(field.value)) {
                showError(field, errorElement, 'Por favor ingresa un correo electrónico válido');
                return false;
            }
        }

        if (field.id === 'phone' && field.value && !/^\d{10,15}$/.test(field.value)) {
            showError(field, errorElement, 'Por favor ingresa un número de teléfono válido (10-15 dígitos)');
            return false;
        }

        if (field.id === 'name' && field.value && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(field.value)) {
            showError(field, errorElement, 'Por favor ingresa solo letras y espacios');
            return false;
        }

        if (field.id === 'message' && field.value.length < 10) {
            showError(field, errorElement, 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }

        return true;
    }

    // Función para mostrar errores
    function showError(field, errorElement, message) {
        field.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
});
