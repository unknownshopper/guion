// Función para crear confeti
function createConfetti() {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
    }
    
    document.body.appendChild(container);
    
    // Eliminar el contenedor después de la animación
    setTimeout(() => {
        container.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Validación en tiempo real
    form.addEventListener('input', function(event) {
        validateField(event.target);
    });

    // Validación al enviar el formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        let isValid = true;
        const formElements = form.elements;
        
        // Validar todos los campos
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.type !== 'hidden') {
                if (!validateField(element)) {
                    isValid = false;
                }
            }
        }

        // Si el formulario es válido, enviar a Formspree
        if (isValid) {
            try {
                // Mostrar estado de carga
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = 'Enviando';
                document.body.style.cursor = 'wait';
                
                // Enviar formulario a Formspree
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Resetear el formulario
                    form.reset();
                    
                    // Mostrar mensaje de éxito
                    formSuccess.style.display = 'block';
                    // Forzar reflow
                    void formSuccess.offsetHeight;
                    formSuccess.classList.add('show');
                    
                    // Mostrar confeti
                    createConfetti();
                    
                    // Desplazarse al mensaje de éxito
                    setTimeout(() => {
                        formSuccess.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                    
                    // Ocultar mensaje después de 5 segundos
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                        setTimeout(() => {
                            formSuccess.style.display = 'none';
                        }, 400);
                    }, 5000);
                    
                    // Redirigir si se especificó una página de agradecimiento
                    const nextPage = form.querySelector('input[name="_next"]');
                    if (nextPage && nextPage.value) {
                        window.location.href = nextPage.value;
                    }
                } else {
                    throw new Error('Error al enviar el formulario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalBtnText;
                document.body.style.cursor = '';
            }
        }
    });

    // Función para validar un campo individual
    function validateField(field) {
        if (!field) return false;
        
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}-error`);
        const formGroup = field.closest ? field.closest('.form-group') : null;
        
        // Limpiar estado previo
        if (field.classList) {
            field.classList.remove('invalid', 'shake');
        }
        
        if (formGroup && formGroup.classList) {
            formGroup.classList.remove('invalid', 'valid');
        }
        
        // Si el campo está vacío y no es requerido, no mostrar error
        if (!value && !field.required) {
            return true;
        }
        
        // Validar campo vacío
        if (field.required && !value) {
            showError(field, errorElement, 'Este campo es obligatorio');
            field.classList.add('shake');
            return false;
        }
        
        // Validar según el tipo de campo
        let isValid = true;
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, errorElement, 'Por favor ingresa un correo electrónico válido');
                isValid = false;
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(value)) {
                showError(field, errorElement, 'El teléfono debe tener entre 10 y 15 dígitos');
                isValid = false;
            }
        } else if (field.type === 'text' && field.id === 'name' && value) {
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
            if (!nameRegex.test(value)) {
                showError(field, errorElement, 'Por favor ingresa solo letras y espacios');
                isValid = false;
            }
        } else if (field.type === 'textarea' && value) {
            if (value.length < 10) {
                showError(field, errorElement, 'El mensaje debe tener al menos 10 caracteres');
                isValid = false;
            }
        }
        
        // Si el campo es válido, marcarlo como tal
        if (isValid) {
            formGroup.classList.add('valid');
            formGroup.classList.remove('invalid');
            if (errorElement) {
                errorElement.style.opacity = '0';
                errorElement.style.height = '0';
                errorElement.style.marginTop = '0';
                setTimeout(() => {
                    errorElement.textContent = '';
                }, 300);
            }
            return true;
        } else {
            formGroup.classList.add('invalid');
            formGroup.classList.remove('valid');
            field.classList.add('shake');
            return false;
        }
    }

    // Función para mostrar errores
    function showError(field, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.opacity = '1';
            errorElement.style.height = 'auto';
            errorElement.style.marginTop = '0.5rem';
        }
    }

    // Verificar si se mostró el mensaje de éxito desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enviado') === 'true') {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // Limpiar el parámetro de la URL sin recargar la página
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
