"use client";

import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Campo de senha com botão de olhinho para alternar entre texto oculto e
 * visível. Usado em qualquer formulário com senha (login, criar conta,
 * admin). */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visivel ? "text" : "password"} className={`${className ?? ""} pr-10`} />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-vinho/50 hover:text-vinho"
      >
        {visivel ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a13.16 13.16 0 0 1-3.67 4.68M6.61 6.61A13.75 13.75 0 0 0 1 11s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <path d="M1 1l22 22" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
