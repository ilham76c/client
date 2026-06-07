'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@mui/material';
import { Button } from './Button';

interface ModalProps extends Omit<DialogProps, 'children'> {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

/**
 * Reusable Modal component
 */
export const Modal = ({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  ...props
}: ModalProps) => {
  return (
    <Dialog onClose={onClose} {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={isLoading}>
          {cancelText}
        </Button>
        {onConfirm && (
          <Button onClick={onConfirm} variant="contained" isLoading={isLoading}>
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};