import React, { createContext, useContext } from 'react';
import type { Identifier } from '../types';

type TableExperienceKeyboardContextValue = {
  focusedRowId: Identifier | null;
};

const TableExperienceKeyboardContext = createContext<TableExperienceKeyboardContextValue>({
  focusedRowId: null,
});

const useTableExperienceKeyboardContext = (): TableExperienceKeyboardContextValue =>
  useContext(TableExperienceKeyboardContext);

type TableExperienceKeyboardProviderProps = {
  focusedRowId: Identifier | null;
  children: React.ReactNode;
};

const TableExperienceKeyboardProvider = ({
  focusedRowId,
  children,
}: TableExperienceKeyboardProviderProps): React.ReactElement => (
  <TableExperienceKeyboardContext.Provider value={{ focusedRowId }}>
    {children}
  </TableExperienceKeyboardContext.Provider>
);

export {
  TableExperienceKeyboardProvider,
  useTableExperienceKeyboardContext,
  TableExperienceKeyboardContext,
};
