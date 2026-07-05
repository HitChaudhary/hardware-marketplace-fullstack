import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buildOptions as baseBuildOptions, buildSteps } from '../data/buildOptions';

const BuildOptionsStoreContext = createContext(null);

const OVERRIDES_KEY = 'ak-buildopt-overrides'; // { [category]: { [id]: partialOption } }
const ADDED_KEY = 'ak-buildopt-added'; // { [category]: [option, ...] }
const DELETED_KEY = 'ak-buildopt-deleted'; // { [category]: [id, ...] }

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function makeOptionId(category) {
  return `${category}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

export function BuildOptionsStoreProvider({ children }) {
  const [overrides, setOverrides] = useState(() => loadJSON(OVERRIDES_KEY, {}));
  const [added, setAdded] = useState(() => loadJSON(ADDED_KEY, {}));
  const [deletedIds, setDeletedIds] = useState(() => loadJSON(DELETED_KEY, {}));

  useEffect(() => saveJSON(OVERRIDES_KEY, overrides), [overrides]);
  useEffect(() => saveJSON(ADDED_KEY, added), [added]);
  useEffect(() => saveJSON(DELETED_KEY, deletedIds), [deletedIds]);

  const buildOptions = useMemo(() => {
    const result = {};
    Object.keys(baseBuildOptions).forEach((category) => {
      const deletedSet = new Set(deletedIds[category] || []);
      const categoryOverrides = overrides[category] || {};
      const merged = [...baseBuildOptions[category], ...(added[category] || [])]
        .filter((o) => !deletedSet.has(o.id))
        .map((o) => (categoryOverrides[o.id] ? { ...o, ...categoryOverrides[o.id] } : o));
      result[category] = merged;
    });
    return result;
  }, [overrides, added, deletedIds]);

  const getOption = (category, id) => buildOptions[category]?.find((o) => o.id === id);

  const addOption = (category, data) => {
    const id = makeOptionId(category);
    const option = {
      id,
      name: data.name?.trim() || 'Untitled Component',
      price: Number(data.price) || 0,
      ...(data.socket ? { socket: data.socket.trim() } : {}),
    };
    setAdded((prev) => ({ ...prev, [category]: [...(prev[category] || []), option] }));
    return option;
  };

  const updateOption = (category, id, data) => {
    const isAdded = (added[category] || []).some((o) => o.id === id);
    const patch = { ...data, price: data.price !== undefined ? Number(data.price) : undefined };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

    if (isAdded) {
      setAdded((prev) => ({
        ...prev,
        [category]: prev[category].map((o) => (o.id === id ? { ...o, ...patch } : o)),
      }));
    } else {
      setOverrides((prev) => ({
        ...prev,
        [category]: { ...(prev[category] || {}), [id]: { ...(prev[category]?.[id] || {}), ...patch } },
      }));
    }
  };

  const deleteOption = (category, id) => {
    const isAdded = (added[category] || []).some((o) => o.id === id);
    if (isAdded) {
      setAdded((prev) => ({ ...prev, [category]: prev[category].filter((o) => o.id !== id) }));
    } else {
      setDeletedIds((prev) => ({
        ...prev,
        [category]: (prev[category] || []).includes(id) ? prev[category] : [...(prev[category] || []), id],
      }));
    }
  };

  return (
    <BuildOptionsStoreContext.Provider
      value={{ buildOptions, buildSteps, getOption, addOption, updateOption, deleteOption }}
    >
      {children}
    </BuildOptionsStoreContext.Provider>
  );
}

export function useBuildOptionsStore() {
  const ctx = useContext(BuildOptionsStoreContext);
  if (!ctx) throw new Error('useBuildOptionsStore must be used within a BuildOptionsStoreProvider');
  return ctx;
}
