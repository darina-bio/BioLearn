document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню (гамбургер)
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burgerBtn.classList.toggle('active');
        });
    }

    // Рендер каталога разделов на sections.html
    const sectionsContainer = document.getElementById('sectionsContainer');
    if (sectionsContainer && typeof sectionsData !== 'undefined') {
        sectionsContainer.innerHTML = sectionsData.map(sec => `
            <a href="section.html?id=${sec.id}" class="section-card">
                <div class="section-icon">${sec.icon}</div>
                <h3>${sec.title}</h3>
                <p>${sec.description}</p>
            </a>
        `).join('');
    }

    // Страница конкретного раздела (section.html)
    const sectionContent = document.getElementById('sectionContent');
    if (sectionContent && typeof sectionsData !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const sectionId = parseInt(urlParams.get('id'));
        const currentSec = sectionsData.find(s => s.id === sectionId);

        if (currentSec) {
            document.title = `${currentSec.title} — BioLearn`;
            
            // Генерация списка тем с уровнями сложности
            const topicsHTML = currentSec.topics && currentSec.topics.length > 0 
                ? currentSec.topics.map(t => `
                    <li>
                        <a href="topic.html?id=${currentSec.id}&topic=${t.id}">
                            <span>${t.title}</span>
                            <span class="difficulty-badge ${t.difficulty === 'Легкий' ? 'easy' : t.difficulty === 'Средний' ? 'medium' : 'hard'}">${t.difficulty}</span>
                        </a>
                    </li>
                  `).join('')
                : '<p style="color: var(--text-light);">Темы для этого раздела скоро появятся.</p>';

            sectionContent.innerHTML = `
                <div class="section-header-banner">
                    <span class="big-icon">${currentSec.icon}</span>
                    <h1>${currentSec.title}</h1>
                    <p>${currentSec.description}</p>
                </div>
                <div class="topics-list">
                    <h2>Темы раздела</h2>
                    <ul class="topic-links">
                        ${topicsHTML}
                    </ul>
                </div>
            `;
        } else {
            sectionContent.innerHTML = `<h2>Раздел не найден</h2><p><a href="sections.html">Вернуться к списку разделов</a></p>`;
        }
    }

    // Страница чтения темы (topic.html)
    const topicContainer = document.getElementById('topicContainer');
    if (topicContainer && typeof sectionsData !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const sectionId = parseInt(urlParams.get('id'));
        const topicId = parseInt(urlParams.get('topic')) || 1;
        const currentSec = sectionsData.find(s => s.id === sectionId);

        const backToSection = document.getElementById('backToSection');
        if (backToSection && currentSec) {
            backToSection.href = `section.html?id=${currentSec.id}`;
            backToSection.textContent = `← Назад к разделу: ${currentSec.title}`;
        }

        if (currentSec && currentSec.topics) {
            const currentTopic = currentSec.topics.find(t => t.id === topicId);
            
            if (currentTopic) {
                document.title = `${currentTopic.title} — BioLearn`;
                
                const mainContent = currentTopic.content.trim() !== '' 
                    ? currentTopic.content 
                    : `<p class="lead">Здесь пока нет учебного материала. Вы можете добавить его в файл данных!</p>
                       <div class="info-box">
                           <strong>💡 Подсказка:</strong> Добавьте текст статьи в файл <code>data/sections.js</code> внутрь поля <code>content</code> для этой темы.
                       </div>`;

                topicContainer.innerHTML = `
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                        <span class="topic-badge">${currentSec.icon} ${currentSec.title}</span>
                        <span class="difficulty-badge ${currentTopic.difficulty === 'Легкий' ? 'easy' : currentTopic.difficulty === 'Средний' ? 'medium' : 'hard'}">${currentTopic.difficulty}</span>
                    </div>
                    <h1>${currentTopic.title}</h1>
                    <div class="topic-body">
                        ${mainContent}
                    </div>
                `;
            } else {
                topicContainer.innerHTML = `<h2>Тема не найдена</h2><p><a href="sections.html">На главную</a></p>`;
            }
        }
    }
});
