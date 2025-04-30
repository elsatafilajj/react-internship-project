import clsx from 'clsx';
import { ChangeEventHandler } from 'react';

import './InputField.css';

type InputFieldProps = {
  id: string;
  name: string;
  value: string;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
  classInput?: string;
  textarea?: boolean;
  classTextarea?: string;
  note?: string;
  required?: boolean;
};

export const InputField = ({
  id,
  name,
  label,
  icon,
  error,
  type,
  onChange,
  disabled,
  className,
  classInput,
  textarea,
  classTextarea,
  note,
  value,
  placeholder,
  required,
  ...rest
}: InputFieldProps) => {
  return (
    <div className={className}>
      <div>
        <label htmlFor={id} className="input-field__label">
          {label}
        </label>

        <div className="relative">
          {textarea ? (
            <textarea
              className={clsx(
                'input-field base2',
                classTextarea,
                icon && 'input-field--with-icon',
                value !== '' && 'input-field--filled',
              )}
              id={name || id}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              {...rest}
            />
          ) : (
            <input
              className={clsx(
                'input-field base2',
                icon && 'input-field--with-icon',
                value !== '' && 'input-field--filled',

                classInput,
              )}
              id={name || id}
              name={name}
              type={type || 'text'}
              value={value}
              onChange={onChange}
              disabled={disabled}
              placeholder={placeholder}
              required={required}
            />
          )}
          {/* <Icon
            className={clsx(
              'absolute top-3.5 left-4 fill-n-4/50 pointer-events-none transition-colors',
              value !== '' && '!fill-n-4',
            )}
            name={icon}
          /> */}
        </div>
        {note && <p className="input-field__note base2">{note}</p>}
        <div className="caption2  input-field__error">
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
};
