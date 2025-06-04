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

// Función para mostrar el mensaje de éxito
function showSuccessMessage() {
    const formSuccess = document.getElementById('form-success');
    if (!formSuccess) {
        console.error('No se encontró el elemento form-success');
        return;
    }
    
    console.log('Mostrando mensaje de éxito...');
    formSuccess.style.display = 'block';
    void formSuccess.offsetHeight; // Forzar reflow
    formSuccess.classList.add('show');
    
    console.log('Clases del mensaje de éxito:', formSuccess.className);
    
    // Desplazarse al mensaje
    setTimeout(() => {
        formSuccess.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        formSuccess.classList.remove('show');
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 400);
    }, 5000);
}

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
    
    // Validar según el tipo de campo
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Por favor ingresa un correo electrónico válido';
    } else if (field.type === 'tel' && !/^\d{10,15}$/.test(value)) {
        isValid = false;
        errorMessage = 'Por favor ingresa un número de teléfono válido (10-15 dígitos)';
    } else if (field.pattern && !new RegExp(field.pattern).test(value)) {
        isValid = false;
        errorMessage = field.title || 'El formato no es válido';
    }
    
    // Mostrar u ocultar mensaje de error
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.style.opacity = '1';
            errorElement.style.height = 'auto';
            errorElement.style.marginTop = '0.5rem';
        } else {
            errorElement.style.opacity = '0';
            errorElement.style.height = '0';
            errorElement.style.marginTop = '0';
            setTimeout(() => {
                errorElement.textContent = '';
            }, 300);
        }
    }
    
    // Agregar clases de validación
    if (formGroup) {
        if (isValid) {
            formGroup.classList.add('valid');
            formGroup.classList.remove('invalid');
        } else {
            formGroup.classList.add('invalid');
            formGroup.classList.remove('valid');
            field.classList.add('shake');
        }
    }
    
    return isValid;
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando formulario...');
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('No se encontró el formulario con ID contactForm');
        return;
    }
    
    const formSuccess = document.getElementById('form-success');
    console.log('Elemento form-success encontrado:', formSuccess);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    // Verificar si se mostró el mensaje de éxito desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enviado') === 'true') {
        console.log('Redirección de éxito detectada, mostrando mensaje...');
        showSuccessMessage();
    }
    
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
                    console.log('Formulario enviado exitosamente');
                    // Resetear el formulario
                    form.reset();
                    
                    // Mostrar mensaje de éxito
                    showSuccessMessage();
                    
                    // Mostrar confeti
                    createConfetti();
                    
                    // Actualizar la URL sin recargar la página
                    window.history.pushState({}, '', 'contacto.html?enviado=true');
                    
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
});

// Verificar si se mostró el mensaje de éxito desde la URL (al cargar la página)
const checkSuccessParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enviado') === 'true') {
        console.log('Redirección de éxito detectada al cargar la página');
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'complete') {
            showSuccessMessage();
        } else {
            document.addEventListener('DOMContentLoaded', showSuccessMessage);
        }
    }
};

// Ejecutar la verificación al cargar la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSuccessParam);
} else {
    checkSuccessParam();
}
