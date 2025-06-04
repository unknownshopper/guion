// Función para crear efecto de pantalla rota y cortocircuito
function createGlitchEffect() {
    // Crear contenedor principal
    const glitchContainer = document.createElement('div');
    glitchContainer.className = 'glitch-container';
    
    // Crear capas de glitch
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'glitch-layer';
        // Tomar captura de pantalla del viewport actual
        layer.style.backgroundImage = `url(${takeScreenshot()})`;
        glitchContainer.appendChild(layer);
    }
    
    // Crear efecto de cortocircuito
    const circuitOverlay = document.createElement('div');
    circuitOverlay.className = 'circuit-overlay';
    
    // Crear efecto de ruido
    const noiseOverlay = document.createElement('div');
    noiseOverlay.className = 'noise';
    
    // Añadir todo al body
    document.body.appendChild(glitchContainer);
    document.body.appendChild(circuitOverlay);
    document.body.appendChild(noiseOverlay);
    
    // Activar efectos
    setTimeout(() => {
        glitchContainer.classList.add('active');
        circuitOverlay.classList.add('active');
        noiseOverlay.classList.add('active');
        
        // Reproducir sonido de estática (opcional)
        playStaticSound();
        
        // Desactivar efectos después de 4 segundos (antes eran 2 segundos)
        setTimeout(() => {
            glitchContainer.classList.remove('active');
            circuitOverlay.classList.remove('active');
            noiseOverlay.classList.remove('active');
            
            // Eliminar elementos después de la animación
            setTimeout(() => {
                glitchContainer.remove();
                circuitOverlay.remove();
                noiseOverlay.remove();
            }, 2000); // Aumentado de 1s a 2s
        }, 4000); // Aumentado de 2s a 4s
    }, 100);
}

// Función para tomar captura de pantalla (simulada)
function takeScreenshot() {
    // En un entorno real, podrías usar html2canvas o una librería similar
    // Para este ejemplo, devolvemos una cadena vacía
    return '';
}

// Función para reproducir sonido de estática
function playStaticSound() {
    // Crear contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Configurar para 4 segundos de estática
    const bufferSize = 4 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generar ruido blanco
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    // Crear fuente de audio
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    
    // Crear filtro para simular estática
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;
    
    // Conectar nodos
    noise.connect(filter);
    filter.connect(audioContext.destination);
    
    // Reproducir estática
    noise.start(0);
    
    // Detener después de 4 segundos
    setTimeout(() => {
        noise.stop();
    }, 4000);
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
                    
                    // Mostrar efecto de pantalla rota
                    createGlitchEffect();
                    
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

// Función para inicializar el botón de efecto especial
function initGlitchButton() {
    console.log('Inicializando botón de efecto especial...');
    const glitchButton = document.getElementById('glitchButton');
    
    if (!glitchButton) {
        console.error('No se encontró el botón de efecto especial');
        return;
    }
    
    console.log('Botón encontrado, agregando evento click...');
    
    glitchButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Botón clickeado, creando efecto...');
        
        // Crear y activar el efecto
        createGlitchEffect();
        
        // Agregar clase para feedback visual
        this.classList.add('active');
        
        // Deshabilitar temporalmente el botón para evitar múltiples clics
        this.disabled = true;
        
        // Remover la clase y reactivar el botón después de la animación
        setTimeout(() => {
            this.classList.remove('active');
            this.disabled = false;
        }, 5000); // Tiempo suficiente para que termine la animación
    });
}

// Inicializar el botón cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        checkSuccessParam();
        initGlitchButton();
    });
} else {
    checkSuccessParam();
    initGlitchButton();
}
