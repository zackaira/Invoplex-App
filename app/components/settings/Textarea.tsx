import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SettingsLabel } from "./Label";
import { SettingsHelperText } from "./HelperText";

interface SettingsTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
}

export function SettingsTextarea({
  label,
  helperText,
  required,
  error,
  className,
  id,
  ...props
}: SettingsTextareaProps) {
  const textareaId =
    id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2">
      <SettingsLabel htmlFor={textareaId} label={label} required={required} />

      <Textarea
        id={textareaId}
        className={cn("py-4", error && "border-destructive", className)}
        {...props}
      />

      {helperText && !error && <SettingsHelperText text={helperText} />}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
