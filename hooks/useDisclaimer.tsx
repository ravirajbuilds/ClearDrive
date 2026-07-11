import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { acceptDisclaimer, hasAcceptedDisclaimer } from '@/src/services/disclaimer';

interface DisclaimerContextValue {
  /** null while loading, then whether the current disclaimer version is accepted. */
  accepted: boolean | null;
  accept: () => Promise<void>;
}

const DisclaimerContext = createContext<DisclaimerContextValue | undefined>(undefined);

export function DisclaimerProvider({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    hasAcceptedDisclaimer()
      .then((ok) => active && setAccepted(ok))
      .catch(() => active && setAccepted(false));
    return () => {
      active = false;
    };
  }, []);

  const accept = useCallback(async () => {
    await acceptDisclaimer();
    setAccepted(true);
  }, []);

  const value = useMemo(() => ({ accepted, accept }), [accepted, accept]);
  return <DisclaimerContext.Provider value={value}>{children}</DisclaimerContext.Provider>;
}

export function useDisclaimer(): DisclaimerContextValue {
  const ctx = useContext(DisclaimerContext);
  if (!ctx) {
    throw new Error('useDisclaimer must be used within a DisclaimerProvider');
  }
  return ctx;
}
