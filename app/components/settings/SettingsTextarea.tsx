import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
      <label htmlFor={textareaId} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Textarea
        id={textareaId}
        className={cn(error && "border-destructive", className)}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
