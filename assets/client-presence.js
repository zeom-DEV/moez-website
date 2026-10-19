(() => {
  'use strict';
  const form = document.querySelector('#mission-brief');
  if (form) {
    const mission = form.querySelector('#brief-mission');
    const message = form.querySelector('#brief-message');
    const send = form.querySelector('#brief-send');
    const status = form.querySelector('#brief-status');
    const preset = new URLSearchParams(location.search).get('mission');
    if ([...mission.options].some(option => option.value === preset)) mission.value = preset;
    const text = () => `Bonjour Moez,\n\nJe vous contacte pour : ${mission.selectedOptions[0].textContent}.\n\n${message.value.trim()}\n\nMerci,`;
    const prepare = () => {
      send.href = 'mailto:contact@moezthabet.com?subject=' + encodeURIComponent('Mission — ' + mission.selectedOptions[0].textContent) + '&body=' + encodeURIComponent(text());
    };
    form.addEventListener('input', prepare);
    mission.addEventListener('change', prepare);
    form.addEventListener('submit', event => event.preventDefault());
    send.addEventListener('click', event => {
      if (!form.reportValidity()) { event.preventDefault(); return; }
      prepare();
      status.textContent = 'Votre message est préparé. Si votre messagerie ne s’ouvre pas, copiez-le et écrivez à contact@moezthabet.com.';
    });
    form.querySelector('#brief-copy').addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      try { await navigator.clipboard.writeText(text()); status.textContent = 'Message copié. Vous pouvez l’envoyer à contact@moezthabet.com.'; }
      catch { status.textContent = 'La copie automatique est indisponible. Sélectionnez votre texte et écrivez à contact@moezthabet.com.'; message.focus(); message.select(); }
    });
    prepare();
  }
  document.querySelectorAll('[data-process]').forEach(widget => {
    const buttons = [...widget.querySelectorAll('[data-process-step]')];
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      widget.querySelector('[data-process-count]').textContent = `ÉTAPE 0${index + 1} / 03`;
      widget.querySelector('[data-process-text]').textContent = button.textContent.replace(/^0\d\s*/, '').trim();
      widget.style.setProperty('--progress', `${(index + 1) / buttons.length * 100}%`);
    }));
  });
})();
