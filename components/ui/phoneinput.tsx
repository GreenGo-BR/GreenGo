import * as React from "react";
import {
  PhoneInput as BasePhoneInput,
  PhoneInputProps,
  PhoneInputRefType,
  ParsedCountry,
} from "react-international-phone";
import "react-international-phone/style.css";

import { cn } from "@/lib/utils";
import type { ChangeHandler, RefCallBack } from "react-hook-form";

type CustomPhoneInputProps = Omit<PhoneInputProps, "inputProps" | "onChange"> &
  React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    error?: boolean;
    onChange?: ChangeHandler;
    onBlur?: ChangeHandler;
    name?: string;
    ref?: RefCallBack;
  };

const PhoneInput = React.forwardRef<PhoneInputRefType, CustomPhoneInputProps>(
  (
    { className, error, onChange, onBlur, name, placeholder, id, ...props },
    ref
  ) => {
    return (
      <BasePhoneInput
        {...props}
        ref={ref}
        defaultCountry="us"
        inputProps={{
          id,
          name,
          placeholder,
          onBlur,
        }}
        className={cn(
          // container
          "flex w-full",
          className
        )}
        inputClassName={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background " +
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground " +
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 " +
            "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        countrySelectorStyleProps={{
          flagStyle: { width: 24, height: 24 },
          buttonStyle: { border: "none", background: "transparent" },
          dropdownStyleProps: { style: { zIndex: 1000 } },
        }}
        style={{ width: "100%" }}
        onChange={(
          value: string,
          meta: { country: ParsedCountry; inputValue: string }
        ) => {
          if (onChange) {
            onChange({
              target: { name, value },
              type: "change",
            } as any);
          }
        }}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
