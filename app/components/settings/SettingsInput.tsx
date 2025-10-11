import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface SettingsInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  startAddon?: string;
  endAddons?: React.ReactNode[];
}

export function SettingsInput({
  label,
  helperText,
  required,
  error,
  className,
  id,
  startAddon,
  endAddons,
  ...props
}: SettingsInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const hasAddons = startAddon || (endAddons && endAddons.length > 0);

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {hasAddons ? (
        <InputGroup>
          <InputGroupInput
            id={inputId}
            className={cn(
              error && "border-destructive",
              startAddon && "pl-[58px]",
              endAddons && endAddons.length > 0 && "pr-[50px]",
              className
            )}
            {...props}
          />
          {startAddon && (
            <InputGroupAddon>
              <InputGroupText>{startAddon}</InputGroupText>
            </InputGroupAddon>
          )}
          {endAddons && endAddons.length > 0 && (
            <InputGroupAddon align="inline-end">
              {endAddons.map((addon, index) => (
                <span key={index}>{addon}</span>
              ))}
            </InputGroupAddon>
          )}
        </InputGroup>
      ) : (
        <Input
          id={inputId}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
      )}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
