export type ToastType = 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export type ToastProps = {
    message: string;
    show: boolean;
    duration?: number;
    onClose: () => void;
    type?: ToastType;
    position?: ToastPosition;
};
