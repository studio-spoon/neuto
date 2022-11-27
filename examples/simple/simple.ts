import { Neuto } from '../../lib/main';

const neuto = new Neuto();

// window.addEventListener('scroll', () => console.log('native scroll'));
// neuto.addEventListener('scroll', () => console.log('neuto scroll'));

window.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    neuto.scrollTo(neuto.scrollY + 500, {
      duration: 1000,
    });
  }
});
