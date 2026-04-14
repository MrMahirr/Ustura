import { showMessage } from 'react-native-flash-message';

type FlashType = 'success' | 'danger' | 'warning' | 'info' | 'default';

export function showFlash(
  title: string,
  message?: string,
  type: FlashType = 'default',
) {
  showMessage({
    message: title,
    description: message,
    type,
    duration: type === 'danger' ? 4000 : 3000,
    floating: true,
    icon: type === 'default' ? 'none' : 'auto',
  });
}

export function showErrorFlash(title: string, message?: string) {
  showFlash(title, message, 'danger');
}

export function showSuccessFlash(title: string, message?: string) {
  showFlash(title, message, 'success');
}

export function showWarningFlash(title: string, message?: string) {
  showFlash(title, message, 'warning');
}

export function showInfoFlash(title: string, message?: string) {
  showFlash(title, message, 'info');
}

/**
 * Destructive confirmation.
 *
 * Overload 1 (legacy): returns Promise<boolean>.
 * Overload 2 (callback): fires `onConfirm` when the user accepts.
 */
export function confirmDestructive(title: string, message: string): Promise<boolean>;
export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void | Promise<void>,
): void;
export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel?: string,
  onConfirm?: () => void | Promise<void>,
): Promise<boolean> | void {
  if (typeof onConfirm === 'function') {
    const label = confirmLabel || 'Onayla';

    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`${title}\n\n${message}`)) {
        void onConfirm();
      }
      return;
    }

    const { Alert } = require('react-native');
    Alert.alert(title, message, [
      { text: 'Iptal', style: 'cancel' },
      { text: label, style: 'destructive', onPress: () => void onConfirm() },
    ]);
    return;
  }

  if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  const { Alert } = require('react-native');
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Iptal', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Onayla', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
