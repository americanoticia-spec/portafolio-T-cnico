document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon between menu and x
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            lucide.createIcons({
                icons: { x: lucide.icons.x },
                nameAttr: 'data-lucide',
                attrs: { class: "lucide lucide-x" }
            });
            mobileBtn.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileBtn.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons(); // Refresh icons
    });

    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });

    // 2. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 5. Cargar datos del CMS (data.json) dinámicamente
    // Esta función intenta leer el archivo data.json generado por Decap CMS.
    // Si falla (por ejemplo, al abrir el HTML localmente sin un servidor), mantendrá el texto original.
    async function loadCMSContent() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) return; // Si no encuentra el archivo, salir.
            
            const data = await response.json();
            
            // Actualizar Hero
            if (data.hero_title) document.querySelector('.hero-content h1').innerHTML = data.hero_title;
            if (data.hero_subtitle) document.querySelector('.hero-content .subtitle').innerHTML = data.hero_subtitle;
            
            // Actualizar Sobre Mí
            if (data.exp_years) document.querySelector('.experience-badge .years').innerHTML = data.exp_years;
            
            const aboutParagraphs = document.querySelectorAll('.sobre-mi-content p');
            if (data.about_p1 && aboutParagraphs.length >= 1) aboutParagraphs[0].innerHTML = data.about_p1;
            if (data.about_p2 && aboutParagraphs.length >= 2) aboutParagraphs[1].innerHTML = data.about_p2;
            if (data.about_p3 && aboutParagraphs.length >= 3) aboutParagraphs[2].innerHTML = data.about_p3;
            
            // Actualizar Proyectos
            if (data.projects && data.projects.length > 0) {
                const portfolioGrid = document.querySelector('.portfolio-grid');
                portfolioGrid.innerHTML = ''; // Limpiar proyectos actuales
                
                data.projects.forEach((project, index) => {
                    const delay = index * 0.1;
                    const defaultUrl = project.url || "#";
                    
                    const projectHTML = `
                    <div class="portfolio-card glass-panel scroll-reveal active" style="transition-delay: ${delay}s;">
                        <div class="portfolio-image">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <div class="portfolio-overlay">
                                <a href="${defaultUrl}" class="btn btn-primary btn-sm" target="_blank">Ver Proyecto</a>
                            </div>
                        </div>
                        <div class="portfolio-content">
                            <div class="portfolio-tags">
                                ${project.tag1 ? `<span class="tag">${project.tag1}</span>` : ''}
                                ${project.tag2 ? `<span class="tag">${project.tag2}</span>` : ''}
                            </div>
                            <h3>${project.title}</h3>
                            <p class="portfolio-desc">${project.desc}</p>
                            <div class="portfolio-tech">
                                <i data-lucide="code" size="14"></i> ${project.tech}
                            </div>
                        </div>
                    </div>`;
                    
                    portfolioGrid.insertAdjacentHTML('beforeend', projectHTML);
                });
                
                lucide.createIcons(); // Recargar iconos para los nuevos proyectos
            }
            
        } catch (error) {
            console.log("Modo local: data.json no cargado por CORS o no encontrado. Mostrando contenido por defecto de index.html");
        }
    }

    // Ejecutar carga de CMS
    loadCMSContent();

});
