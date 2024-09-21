document.querySelectorAll('[data-accordion-btn]').forEach(button => {
    button.addEventListener('click', () => {
        const accordionItem = button.parentElement;

        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
            if (item !== accordionItem) {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
                item.querySelector('.icon').textContent = '+';
            }
        });

        // Toggle current accordion item
        accordionItem.classList.toggle('active');

        const accordionContent = accordionItem.querySelector('.accordion-content');
        if (accordionItem.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            button.querySelector('.icon').textContent = '-';
        } else {
            accordionContent.style.maxHeight = null;
            button.querySelector('.icon').textContent = '+';
        }
    });
});
