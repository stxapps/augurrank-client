import { authenticate, openContractCall, DEFAULT_PROVIDERS } from '@stacks/connect';
import { getProviderFromId } from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';

const LEATHER_PROVIDER = 'LeatherProvider';

const wrapConnectCall = (action) => (options) => {
  // Support only Leather for now;
  const provider = getProviderFromId(LEATHER_PROVIDER);
  if (provider) return action(options, provider);

  if (typeof window === 'undefined') return;
  defineCustomElements(window);

  const element = document.createElement('connect-modal');
  element.defaultProviders = DEFAULT_PROVIDERS.filter(p => p.id === LEATHER_PROVIDER);
  element.installedProviders = [];
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

export const showConnect = wrapConnectCall(authenticate);
export const showContractCall = wrapConnectCall(openContractCall);
