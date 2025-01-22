import {
  authenticate, openSignatureRequestPopup, openContractCall, DEFAULT_PROVIDERS,
} from '@stacks/connect';
import {
  getSelectedProviderId, setSelectedProviderId, clearSelectedProviderId,
  getProviderFromId,
} from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';

const LEATHER_PROVIDER = 'LeatherProvider';
const XVERSE_PROVIDER = 'XverseProviders.StacksProvider';

const wrapConnectCall = (action, doSelected) => (options) => {
  if (doSelected) {
    const pvdId = getSelectedProviderId();
    if (pvdId) {
      const pvd = getProviderFromId(pvdId);
      if (pvd) return action(options, pvd);
    }
  }

  const ltPvd = getProviderFromId(LEATHER_PROVIDER);
  const xvPvd = getProviderFromId(XVERSE_PROVIDER);

  if (ltPvd && !xvPvd) {
    setSelectedProviderId(LEATHER_PROVIDER);
    return action(options, ltPvd);
  }
  if (!ltPvd && xvPvd) {
    setSelectedProviderId(XVERSE_PROVIDER);
    return action(options, xvPvd);
  }

  const defaultProviders = DEFAULT_PROVIDERS.filter(p => {
    return [LEATHER_PROVIDER, XVERSE_PROVIDER].includes(p.id);
  });
  const installedProviders = defaultProviders.filter(p => {
    if (p.id === LEATHER_PROVIDER && ltPvd) return true;
    if (p.id === XVERSE_PROVIDER && xvPvd) return true;
    return false;
  });

  if (typeof window === 'undefined') return;
  defineCustomElements(window);

  const element = document.createElement('connect-modal');
  element.defaultProviders = defaultProviders;
  element.installedProviders = installedProviders;
  element.persistSelection = true;

  const closeModal = () => {
    element.remove();
  };
  const callback = (selectedProvider) => {
    closeModal();
    action(options, selectedProvider);
  };
  const cancelCallback = () => {
    closeModal();
    if (options.onCancel) options.onCancel();
  };
  element.callback = callback;
  element.cancelCallback = cancelCallback;

  document.body.appendChild(element);

  const handleEsc = (ev) => {
    if (ev.key === 'Escape') {
      document.removeEventListener('keydown', handleEsc);
      cancelCallback();
    }
  };
  document.addEventListener('keydown', handleEsc);
};

export const showConnect = wrapConnectCall(authenticate, false);
export const showSignMessage = wrapConnectCall(openSignatureRequestPopup, true);
export const showContractCall = wrapConnectCall(openContractCall, true);
export const deleteSelectedWallet = clearSelectedProviderId;
