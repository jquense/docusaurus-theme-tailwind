/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useEffect } from "react";
import type { UseTabGroupChoiceReturns } from "@theme/hooks/useTabGroupChoice";
import { createStorageSlot, listStorageKeys } from "@docusaurus/theme-common";

const TAB_CHOICE_PREFIX = "docusaurus.tab.";

const useTabGroupChoice = (): UseTabGroupChoiceReturns => {
  const [tabGroupChoices, setChoices] = useState<{
    readonly [groupId: string]: string;
  }>({});
  const setChoiceSyncWithLocalStorage = useCallback((groupId, newChoice) => {
    createStorageSlot(`${TAB_CHOICE_PREFIX}${groupId}`).set(newChoice);
  }, []);

  useEffect(() => {
    try {
      const localStorageChoices = {};
      for (const storageKey of listStorageKeys()) {
        if (storageKey.startsWith(TAB_CHOICE_PREFIX)) {
          const groupId = storageKey.substring(TAB_CHOICE_PREFIX.length);
          localStorageChoices[groupId] = createStorageSlot(storageKey).get();
        }
      }
      setChoices(localStorageChoices);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return {
    tabGroupChoices,
    setTabGroupChoices: (groupId: string, newChoice: string) => {
      setChoices((oldChoices) => ({ ...oldChoices, [groupId]: newChoice }));
      setChoiceSyncWithLocalStorage(groupId, newChoice);
    },
  };
};

export default useTabGroupChoice;
