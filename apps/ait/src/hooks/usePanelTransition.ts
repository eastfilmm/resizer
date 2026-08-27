import { useState, useEffect, useRef, useCallback } from 'react';
import type { NavPanelType } from '@/atoms/imageAtoms';

export function usePanelTransition(activePanel: NavPanelType) {
    const [displayedPanel, setDisplayedPanel] = useState<NavPanelType>(null);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timer helper
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => clearTimer, [clearTimer]);

    // Handle panel transition with fade out -> height change -> fade in
    useEffect(() => {
        clearTimer();

        if (activePanel === null) {
            // Closing: fade out first, then collapse
            setIsContentVisible(false);
            timerRef.current = setTimeout(() => {
                setDisplayedPanel(null);
            }, 150); // Match opacity transition duration
        } else {
            // Opening or switching panels
            if (displayedPanel === null) {
                // Opening from closed: set panel immediately, then fade in
                setDisplayedPanel(activePanel);
                timerRef.current = setTimeout(() => {
                    setIsContentVisible(true);
                }, 50); // Small delay to ensure height transition started
            } else if (activePanel !== displayedPanel) {
                // Switching panels: fade out -> change panel -> fade in
                setIsContentVisible(false);
                timerRef.current = setTimeout(() => {
                    setDisplayedPanel(activePanel);
                    setIsContentVisible(true);
                }, 150); // Wait for fade out then switch and fade in at once
            } else {
                // Same panel: ensure it's visible
                setIsContentVisible(true);
            }
        }
    }, [activePanel, clearTimer]); // Exclude displayedPanel/isContentVisible to prevent loops

    return { displayedPanel, isContentVisible };
}
