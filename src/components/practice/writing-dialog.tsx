// src/components/practice/writing-dialog.tsx v5.3.0
'use client';

import { useRef, useState } from 'react';
import { useTranslation } from '@/components/locale-provider';
import type { CharacterQuiz } from '@/components/practice/practice-assets';
import { WritingCanvas, type WritingCanvasHandle } from '@/components/practice/writing-canvas';
import { ErrorState } from '@/components/state/state-views';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { loadStrokeOrder } from '@/lib/stroke-order-loader';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WritingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: CharacterQuiz;
  strokeCount: number;
  onNext: () => void;
}

export function WritingDialog({ open, onOpenChange, character, strokeCount, onNext }: WritingDialogProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<WritingCanvasHandle>(null);
  // 描红整体准确度（0-1），由 WritingCanvas 跟写判定后回调
  const [accuracy, setAccuracy] = useState<number | null>(null);
  // 笔顺数据按需加载：打开弹窗/切换字符时才拉取对应 chunk（P1-12），失败可重试
  const {
    data: strokeData,
    loading: strokeLoading,
    error: strokeError,
    retry: retryStroke,
  } = useAsyncResource(() => loadStrokeOrder(character.hanzi), `stroke-order:${character.hanzi}`, open);

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
    setAccuracy(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="writing-dialog" closeLabel={t('common.close')} className="border-border bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">
            {t('practice.writingTitle')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('practice.writingDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vermilion-50">
              <span className="font-serif text-3xl text-vermilion-600">{character.hanzi}</span>
            </div>
            <div className="text-start">
              <Badge variant="outline" className="border-vermilion-200 text-vermilion-700">
                {character.pinyin}
              </Badge>
              <p className="mt-1 text-sm text-muted-foreground">{t(character.meaningKey)}</p>
            </div>
          </div>

          <div
            id="writing-canvas-region"
            className="relative aspect-square w-full overflow-hidden rounded-lg border border-dashed border-border bg-card"
          >
            {strokeLoading ? (
              // 骨架屏：加载期间占位，避免画布尺寸塌陷与内容闪烁
              <div
                id="writing-stroke-skeleton"
                role="status"
                aria-label={t('common.practiceWriting')}
                aria-busy="true"
                className="h-full w-full animate-pulse rounded-lg bg-muted/60"
              />
            ) : strokeError ? (
              <div id="writing-stroke-error" className="h-full w-full">
                <ErrorState className="h-full py-8" onRetry={retryStroke} />
              </div>
            ) : (
              <WritingCanvas
                key={character.hanzi}
                ref={canvasRef}
                character={character.hanzi}
                strokePaths={strokeData?.strokes}
                medians={strokeData?.medians}
                strokeCount={strokeCount}
                onAccuracyChange={setAccuracy}
              />
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {t('practice.strokeCount', { count: strokeCount })}
          </p>

          {accuracy !== null && (
            <p className="text-center text-sm text-vermilion-700">
              {t('practice.accuracy')}: {Math.round(accuracy * 100)}%
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={clearCanvas} className="border-border">
            {t('practice.clear')}
          </Button>
          <Button onClick={() => { clearCanvas(); onNext(); }} className="bg-vermilion-600 hover:bg-vermilion-700">
            {t('practice.next')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
