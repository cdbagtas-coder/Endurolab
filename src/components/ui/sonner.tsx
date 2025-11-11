"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#1e293b',
          border: '1px solid #475569',
          color: '#f1f5f9',
        },
        classNames: {
          description: 'text-slate-300',
          actionButton: 'bg-teal-500 text-white',
          cancelButton: 'bg-slate-600 text-white',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
