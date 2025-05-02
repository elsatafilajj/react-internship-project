import * as React from 'react';

import { cn } from '../../lib/utils';

type CommonProps = {
  name: string;
  label?: string;
  className?: string;
};

type TextareaProps = CommonProps & {
  isTextArea: true;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type TextInputProps = CommonProps & {
  isTextArea?: false;
  type?: string;
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
    // label,
    className,
    isTextArea = false,
    value,
    onChange,
    error,
    ...rest
  } = props;

  // Don't destructure 'name' from rest — just remove it manually when spreading
  const inputProps = { ...rest } as Omit<
    React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'name'
  >;

  return (
    <div>
      {/* {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-green-900"
        >
          {label}
        </label>
      )} */}

      {isTextArea ? (
        <textarea
          id={name}
          value={value}
          onChange={onChange}
          data-slot="input"
          className={cn(
            'bg-green-100 border border-green-300 text-green-900 placeholder-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 w-full p-2.5  shadow-xs outline-none transition-[color,box-shadow] active:bg-transparent',
            className,
          )}
          {...inputProps}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={(props as TextInputProps).type || 'text'}
          value={value}
          onChange={onChange}
          data-slot="input"
          className={cn(
            'w-full px-0 py-2 text-black text-sm bg-transparent border-b border-muted-foreground/45',
            'placeholder:text-muted-foreground/50 active:bg-transparent focus:outline-none focus:border-[#30efa6] focus:text-black',
            'transition-all duration-300 ease-in-out',
            'focus:ring-0 focus:shadow-[0_1px_0_0_#30efa6]',
            className,
          )}
          {...inputProps}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
