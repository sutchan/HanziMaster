// src/components/cloud-sync-confirm-dialog.tsx v5.3.0
// 受控确认弹窗：用现有 Radix Dialog 组合出 alertdialog 语义，替换 window.confirm（不新增依赖）。
'use client';

import { useLocale } from '@/components/locale-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

type CloudSyncConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CloudSyncConfirmDialog({ open, onOpenChange, onConfirm }: CloudSyncConfirmDialogProps) {
  const { t } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="cloud-regenerate-dialog" role="alertdialog" showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle id="cloud-regenerate-title">{t('cloud.confirmTitle')}</DialogTitle>
          <DialogDescription id="cloud-regenerate-desc">{t('cloud.confirmDesc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter id="cloud-regenerate-actions">
          <Button type="button" id="cloud-regenerate-cancel" variant="outline" size="sm"
            onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="button" id="cloud-regenerate-confirm" variant="destructive" size="sm"
            onClick={() => { onOpenChange(false); onConfirm(); }}>
            {t('cloud.confirmOk')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
