// src/lib/i18n/translations/extensions/progress.ts v5.2.59
// 进度导出/导入入口与持久化失败提示文案（11 语言齐全）。

export interface ProgressTexts {
  exportLabel: string;
  importLabel: string;
  importInvalid: string;
  importDone: string;
  persistFailed: string;
}

export const progressByLocale: Record<string, ProgressTexts> = {
  en: { exportLabel: 'Export progress', importLabel: 'Import progress', importInvalid: 'Invalid or corrupted backup file', importDone: 'Progress imported successfully', persistFailed: 'Progress could not be saved in this browser. Check private mode or storage space.' },
  'zh-CN': { exportLabel: '导出学习进度', importLabel: '导入学习进度', importInvalid: '备份文件无效或已损坏', importDone: '学习进度已导入', persistFailed: '学习进度未能保存到当前浏览器，请检查隐私模式或存储空间。' },
  'zh-TW': { exportLabel: '匯出學習進度', importLabel: '匯入學習進度', importInvalid: '備份檔案無效或已損壞', importDone: '學習進度已匯入', persistFailed: '學習進度無法儲存至目前瀏覽器，請檢查隱私模式或儲存空間。' },
  es: { exportLabel: 'Exportar progreso', importLabel: 'Importar progreso', importInvalid: 'Archivo de copia no válido o dañado', importDone: 'Progreso importado correctamente', persistFailed: 'No se pudo guardar el progreso en este navegador. Revise el modo privado o el espacio de almacenamiento.' },
  ar: { exportLabel: 'تصدير التقدم', importLabel: 'استيراد التقدم', importInvalid: 'ملف النسخة الاحتياطية غير صالح أو تالف', importDone: 'تم استيراد التقدم بنجاح', persistFailed: 'تعذّر حفظ التقدّم في هذا المتصفح. تحقّق من وضع التصفّح الخاص أو مساحة التخزين.' },
  fr: { exportLabel: 'Exporter la progression', importLabel: 'Importer la progression', importInvalid: 'Fichier de sauvegarde invalide ou corrompu', importDone: 'Progression importée avec succès', persistFailed: 'Impossible d’enregistrer la progression dans ce navigateur. Vérifiez le mode privé ou l’espace de stockage.' },
  'pt-BR': { exportLabel: 'Exportar progresso', importLabel: 'Importar progresso', importInvalid: 'Arquivo de backup inválido ou corrompido', importDone: 'Progresso importado com sucesso', persistFailed: 'Não foi possível salvar o progresso neste navegador. Verifique o modo privado ou o espaço de armazenamento.' },
  de: { exportLabel: 'Fortschritt exportieren', importLabel: 'Fortschritt importieren', importInvalid: 'Ungültige oder beschädigte Sicherungsdatei', importDone: 'Fortschritt erfolgreich importiert', persistFailed: 'Der Fortschritt konnte in diesem Browser nicht gespeichert werden. Prüfen Sie den privaten Modus oder den Speicherplatz.' },
  ja: { exportLabel: '学習進捗をエクスポート', importLabel: '学習進捗をインポート', importInvalid: 'バックアップファイルが無効または破損しています', importDone: '学習進捗をインポートしました', persistFailed: 'このブラウザに進捗を保存できませんでした。プライベートモードや保存容量を確認してください。' },
  ko: { exportLabel: '학습 진행 내보내기', importLabel: '학습 진행 가져오기', importInvalid: '백업 파일이 유효하지 않거나 손상되었습니다', importDone: '학습 진행을 가져왔습니다', persistFailed: '이 브라우저에 진행 상황을 저장할 수 없습니다. 프라이빗 모드나 저장 공간을 확인하세요.' },
  ru: { exportLabel: 'Экспорт прогресса', importLabel: 'Импорт прогресса', importInvalid: 'Недопустимый или повреждённый файл резервной копии', importDone: 'Прогресс успешно импортирован', persistFailed: 'Не удалось сохранить прогресс в этом браузере. Проверьте приватный режим или место в хранилище.' },
};
