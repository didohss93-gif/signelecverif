/**
 * Helper d'intégration — Carte Vitale fictive (démo / soutenance CPAM)
 *
 * Usage côté logiciel métier :
 *   import { openCarteVitaleFictive, buildCarteVitaleUrl } from './carte-vitale-bridge.js';
 *   openCarteVitaleFictive({ prenom: 'Alex', nom: 'MARTIN', nir: '185017512345678', emise: '12/04/2024' });
 *
 * Ou en script classique (global window.CarteVitaleBridge).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CarteVitaleBridge = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function b64urlEncode(str) {
    var b64;
    if (typeof btoa === 'function') {
      b64 = btoa(unescape(encodeURIComponent(str)));
    } else if (typeof Buffer !== 'undefined') {
      b64 = Buffer.from(str, 'utf8').toString('base64');
    } else {
      throw new Error('Aucun encodeur Base64 disponible');
    }
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function normalizeAssuré(data) {
    data = data || {};
    return {
      prenom: String(data.prenom || data.firstName || '').trim(),
      nom: String(data.nom || data.lastName || '').trim().toUpperCase(),
      nir: String(data.nir || data.ssn || '').trim(),
      emise: String(data.emise || data.issued || '').trim(),
      serie: String(data.serie || data.serial || '').trim(),
      fictive: true,
      usage: 'demo-soutenance-cpam'
    };
  }

  /**
   * @param {object} assure Données assuré fictives
   * @param {object} [opts]
   * @param {string} [opts.baseUrl] URL de carte-vitale.html (défaut: relatif)
   * @returns {string}
   */
  function buildCarteVitaleUrl(assure, opts) {
    opts = opts || {};
    var base = opts.baseUrl || 'carte-vitale.html';
    var payload = normalizeAssuré(assure);
    return base.replace(/#.*$/, '') + '#d=' + b64urlEncode(JSON.stringify(payload));
  }

  /**
   * Ouvre le générateur prérempli (nouvel onglet par défaut).
   */
  function openCarteVitaleFictive(assure, opts) {
    opts = opts || {};
    var url = buildCarteVitaleUrl(assure, opts);
    var target = opts.target || '_blank';
    if (typeof window !== 'undefined' && window.open) {
      window.open(url, target, 'noopener,noreferrer');
    }
    return url;
  }

  return {
    buildCarteVitaleUrl: buildCarteVitaleUrl,
    openCarteVitaleFictive: openCarteVitaleFictive,
    normalizeAssuré: normalizeAssuré
  };
});
