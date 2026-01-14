'use client';

import { useCallback, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { copyrightEnabledAtom, copyrightTextAtom } from '@/atoms/imageAtoms';
import { COPYRIGHT_STORAGE_KEY } from '@/constants/canvas';
import { PanelContainer, PanelRow, PanelLabel, ToggleSwitch, TextInput } from './shared';

export const CopyrightPanel = () => {
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);
  const setCopyrightEnabled = useSetAtom(copyrightEnabledAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const setCopyrightText = useSetAtom(copyrightTextAtom);

  // Load saved text from localStorage
  useEffect(() => {
    const savedText = localStorage.getItem(COPYRIGHT_STORAGE_KEY);
    if (savedText) {
      setCopyrightText(savedText);
    }
  }, [setCopyrightText]);

  const toggleCopyright = useCallback(() => {
    setCopyrightEnabled((prev) => !prev);
  }, [setCopyrightEnabled]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCopyrightText(e.target.value);
    },
    [setCopyrightText]
  );

  return (
    <PanelContainer>
      <PanelRow>
        <PanelLabel>Copyright</PanelLabel>
        <ToggleSwitch $isActive={copyrightEnabled} onClick={toggleCopyright} />
      </PanelRow>
      <TextInput
        type="text"
        placeholder="© Your Name"
        value={copyrightText}
        onChange={handleTextChange}
        disabled={!copyrightEnabled}
      />
    </PanelContainer>
  );
};
