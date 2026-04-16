'use strict';

const detailsList = Array.from(document.querySelectorAll('.accordion__item'));
const expandBtn = document.getElementById('expandAll');
const collapseBtn = document.getElementById('collapseAll');

if (expandBtn) {
  expandBtn.addEventListener('click', () => {
    detailsList.forEach(item => {
      item.open = true;
    });
  });
}

if (collapseBtn) {
  collapseBtn.addEventListener('click', () => {
    detailsList.forEach(item => {
      item.open = false;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
