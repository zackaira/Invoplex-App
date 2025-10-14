"use client";

import { useState, useEffect } from "react";
import {
  parsePhoneNumber,
  getCountryCallingCode,
  AsYouType,
  isValidPhoneNumber,
  CountryCode,
  getCountries,
} from "libphonenumber-js";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { SettingsLabel } from "./Label";
import { SettingsHelperText } from "./HelperText";

interface SettingsPhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string, isValid: boolean) => void;
  defaultCountry?: CountryCode;
}

// Country code to flag emoji mapping
const getCountryFlag = (countryCode: string | undefined): string => {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Detect country from calling code (handles shared calling codes like +1)
const detectCountryFromCallingCode = (
  phoneNumber: string,
  defaultCountry?: CountryCode
): CountryCode | undefined => {
  // Early return if no phone number
  if (!phoneNumber || phoneNumber.trim() === "" || phoneNumber === "+") {
    return undefined;
  }

  try {
    // First, try to parse the full number (works with longer inputs)
    const parsed = parsePhoneNumber(phoneNumber, defaultCountry);
    if (parsed?.country) {
      return parsed.country;
    }

    // If country is undefined (e.g., +1 is ambiguous between US/CA),
    // use the default country if it matches the calling code
    if (parsed && defaultCountry) {
      try {
        const defaultCallingCode = getCountryCallingCode(defaultCountry);
        const parsedCallingCode = parsed.countryCallingCode;
        if (defaultCallingCode === parsedCallingCode) {
          return defaultCountry;
        }
      } catch (e) {
        // Continue to fallback logic
      }
    }
  } catch (e) {
    // Parsing failed, continue to manual extraction
  }

  // Fallback: Extract calling code from the string and match to country
  const match = phoneNumber.match(/^\+(\d{1,3})/);
  if (match) {
    const callingCode = match[1];
    const countries = getCountries();

    // First pass: check if default country matches this calling code
    if (defaultCountry) {
      try {
        if (getCountryCallingCode(defaultCountry) === callingCode) {
          return defaultCountry;
        }
      } catch (e) {
        // Continue to next check
      }
    }

    // Second pass: find any country with this calling code
    for (const country of countries) {
      try {
        if (getCountryCallingCode(country) === callingCode) {
          return country;
        }
      } catch (e) {
        continue;
      }
    }
  }

  return undefined;
};

export function SettingsPhoneInput({
  label,
  helperText,
  required,
  error,
  className,
  id,
  value = "",
  onChange,
  defaultCountry = "US",
  ...props
}: SettingsPhoneInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const [phoneValue, setPhoneValue] = useState(value);
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Update local state when external value changes
  useEffect(() => {
    if (value !== phoneValue) {
      setPhoneValue(value);
      // Parse and update country code
      if (value) {
        const detectedCountry = detectCountryFromCallingCode(
          value,
          defaultCountry
        );
        setCountryCode(detectedCountry);
        try {
          const parsed = parsePhoneNumber(value, defaultCountry);
          if (parsed) {
            setIsValid(parsed.isValid());
          }
        } catch (e) {
          setIsValid(false);
        }
      } else {
        setCountryCode(undefined);
        setIsValid(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, defaultCountry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow digits, spaces, parentheses, dashes, and plus sign
    const sanitized = inputValue.replace(/[^\d\s()\-+]/g, "");

    // Create AsYouType formatter
    const formatter = new AsYouType(defaultCountry);
    const formattedValue = formatter.input(sanitized);

    // Get the country from the formatter first
    let detectedCountry = formatter.getNumber()?.country;

    // If formatter didn't detect a country, use our custom detection
    if (!detectedCountry && sanitized) {
      detectedCountry = detectCountryFromCallingCode(sanitized, defaultCountry);
    }

    setCountryCode(detectedCountry);

    // Check if the phone number is valid
    let valid = false;
    try {
      valid = isValidPhoneNumber(sanitized);
    } catch (e) {
      valid = false;
    }

    setPhoneValue(formattedValue);
    setIsValid(valid);

    // Call parent onChange with formatted value and validity
    if (onChange) {
      onChange(formattedValue, valid);
    }
  };

  const flag = getCountryFlag(countryCode);

  return (
    <div className="space-y-2">
      <SettingsLabel
        htmlFor={inputId}
        className="text-sm font-medium"
        label={label}
        required={required}
      />

      <InputGroup>
        <InputGroupInput
          id={inputId}
          type="tel"
          value={phoneValue}
          onChange={handleChange}
          className={cn(
            "py-6",
            error && "border-destructive",
            flag && "pr-[50px]",
            className
          )}
          {...props}
        />
        {flag && (
          <InputGroupAddon align="inline-end">
            <span
              className="text-2xl leading-none"
              role="img"
              aria-label={`${countryCode} flag`}
            >
              {flag}
            </span>
          </InputGroupAddon>
        )}
      </InputGroup>

      {helperText && !error && <SettingsHelperText text={helperText} />}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
