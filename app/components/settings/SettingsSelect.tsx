import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsLabel } from "./SettingsLabel";
import { cn } from "@/lib/utils";
import { SettingsHelperText } from "./SettingsHelperText";

interface SettingsSelectProps {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

export function SettingsSelect({
  label,
  helperText,
  required,
  error,
  placeholder,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
}: SettingsSelectProps) {
  const selectId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2">
      <SettingsLabel htmlFor={selectId} label={label} required={required} />

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={cn("py-6", error ? "border-destructive" : "")}
        >
          <SelectValue
            placeholder={placeholder || `Select ${label.toLowerCase()}`}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {helperText && !error && <SettingsHelperText text={helperText} />}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
