import React from 'react';
import type { ChatInputProps } from './types';
import type { KdesignElementRef } from '~utils/types';
import type { KdesignFile, KdesignFileList } from '~components/FileUpload/types';
import { generateFileId } from '~components/FileUpload/generateFileId';
import { useControllableState } from '~utils/useControllable';
import { useMergeRefs } from '~utils/useMergeRefs';
import { getChatInputSubmitDisabled } from './getChatInputSubmitDisabled';

type UseChatInputProps = Pick<
  ChatInputProps,
  'value' | 'defaultValue' | 'onChange' | 'onSubmit' | 'fileList' | 'onFileRemove' | 'onFileDismiss'
>;

const useChatInput = (
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onSubmit,
    fileList: controlledFileList,
    onFileRemove,
    onFileDismiss,
  }: UseChatInputProps,
  ref: React.ForwardedRef<KdesignElementRef>,
): {
  mergedRef: React.RefCallback<KdesignElementRef>;
  textValue: string;
  files: KdesignFileList;
  hasFiles: boolean;
  isSubmitDisabled: boolean;
  handleTextChange: (args: { name?: string; value?: string }) => void;
  handleSubmit: () => void;
  handleFileRemove: (file: KdesignFile) => void;
  handleFileDismiss: (file: KdesignFile) => void;
} => {
  const inputRef = React.useRef<KdesignElementRef>(null);
  const mergedRef = useMergeRefs(ref, inputRef);

  const [textValue, setTextValue] = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue ?? '',
    onChange: (newValue) => {
      onChange?.({ value: newValue });
    },
  });

  const [rawFiles, setFiles] = useControllableState<KdesignFileList>({
    value: controlledFileList,
    defaultValue: controlledFileList ?? [],
  });

  // Derive a new array with stable IDs assigned — never mutates the consumer's file objects.
  const files = React.useMemo<KdesignFileList>(
    () => rawFiles.map((file) => (file.id ? file : { ...file, id: generateFileId() })),
    [rawFiles],
  );

  const hasFiles = files.length > 0;
  const isSubmitDisabled = getChatInputSubmitDisabled(textValue, files);

  const handleTextChange = React.useCallback(
    ({ value: newValue }: { name?: string; value?: string }) => {
      setTextValue(() => newValue ?? '');
    },
    [setTextValue],
  );

  const handleSubmit = React.useCallback(() => {
    if (isSubmitDisabled) return;
    onSubmit?.({ value: textValue, fileList: files });
  }, [isSubmitDisabled, onSubmit, textValue, files]);

  const handleFileRemove = React.useCallback(
    (file: KdesignFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileRemove?.({ file });
    },
    [files, setFiles, onFileRemove],
  );

  const handleFileDismiss = React.useCallback(
    (file: KdesignFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileDismiss?.({ file });
    },
    [files, setFiles, onFileDismiss],
  );

  return {
    mergedRef,
    textValue,
    files,
    hasFiles,
    isSubmitDisabled,
    handleTextChange,
    handleSubmit,
    handleFileRemove,
    handleFileDismiss,
  };
};

export { useChatInput };
export type { UseChatInputProps };
