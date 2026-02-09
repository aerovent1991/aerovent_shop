"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "site_pass_ok";
const PASSWORD = "1212";

type Props = {
  children: React.ReactNode;
};

export function SimplePasswordGate({ children }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const allowed = window.localStorage.getItem(STORAGE_KEY) === "1";
    setIsAllowed(allowed);
    setIsReady(true);
  }, []);

  const form = useMemo(() => {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <form
          className="w-full max-w-sm border border-white/20 rounded-lg p-6 bg-black/70"
          onSubmit={(event) => {
            event.preventDefault();
            if (value === PASSWORD) {
              window.localStorage.setItem(STORAGE_KEY, "1");
              setIsAllowed(true);
              setError("");
              return;
            }
            setError("Неправильний пароль");
            setValue("");
            setIsAllowed(false);
          }}
        >
          <h1 className="text-xl font-semibold mb-3">Доступ до сайту</h1>
          <label className="block text-sm text-white/70 mb-2" htmlFor="site-password">
            Введіть пароль
          </label>
          <input
            id="site-password"
            type="password"
            className="w-full rounded-md bg-black border border-white/30 px-3 py-2 text-white outline-none focus:border-white"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
          {error ? <p className="text-red-400 text-sm mt-2">{error}</p> : null}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-white text-black py-2 font-semibold"
          >
            Увійти
          </button>
        </form>
      </div>
    );
  }, [error, value]);

  if (!isReady) {
    return null;
  }

  if (!isAllowed) {
    return form;
  }

  return <>{children}</>;
}
