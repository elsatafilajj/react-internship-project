import * as React from 'react';

import { cn } from '@/lib/utils';

type CommonProps = {
  name: string;
  label?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  rightElement?: React.ReactNode;
};

type TextareaProps = CommonProps & {
  isTextArea: true;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type TextInputProps = CommonProps & {
  isTextArea?: false;
} & React.InputHTMLAttributes<HTMLInputElement>;

type Props = TextareaProps | TextInputProps;

export function Input(
  props: Props & {
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    error?: string;
  },
) {
  const {
    name,
    label,
    type,
    className,
    isTextArea = false,
    value,
    onChange,
    error,
    rightElement,
    ...rest
  } = props;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          data-slot="input"
          className={cn(
            'bg-transparent text-wrap border-b border-muted-foreground/45 text-foreground placeholder:text-muted-foreground/50 text-sm rounded-lg focus:ring-0 focus:border-primary w-full p-2.5  shadow-xs outline-none transition-[color,box-shadow] active:bg-transparent disabled:opacity-50',
            className,
          )}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            data-slot="input"
            className={cn(
              'w-full px-0 py-2 pr-10 text-foreground text-sm bg-transparent border-b border-muted-foreground/45 disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-muted-foreground active:bg-transparent focus:outline-none focus:border-primary',
              'transition-all duration-300 ease-in-out focus:ring-0 focus:shadow-2xs focus:shadow-primary overflow-x-scroll',
              className,
            )}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          {rightElement && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 px-2 cursor-pointer">
              {rightElement}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
