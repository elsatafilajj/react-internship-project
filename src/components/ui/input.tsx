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
            'w-full px-0 py-2 text-black text-sm bg-transparent border-b  border-input',
            'placeholder-placeholder-color focus:outline-none focus:border-primary focus:black',
            'transition-all duration-300 ease-in-out',
            'focus:ring-0 focus:shadow-[0_1px_0_0_#30efa6]',
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
            'w-full px-0 py-2 text-black text-sm bg-transparent border-b border-input',
            'placeholder-placeholder-color focus:outline-none focus:border-primary focus:black',
            'transition-all duration-300 ease-in-out',
            'focus:ring-0 focus:shadow-[0_1px_0_0_#30efa6]',
            className,
          )}
          {...inputProps}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
