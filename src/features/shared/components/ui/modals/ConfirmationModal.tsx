// src/features/shared/components/ui/modals/ConfirmationModal.tsx
import React from 'react';
import { NeonCard } from '../cards/NeonCard';
import { MixButton } from '../buttons/MixButton';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  
  return (
    <div className="modal-overlay">
      <NeonCard title={title}>
        <p>{message}</p>
        <div className="modal-actions">
          <MixButton onClick={onCancel}>Cancel</MixButton>
          <MixButton onClick={onConfirm}>Confirm</MixButton>
        </div>
      </NeonCard>
    </div>
  );
};