interface SettingsLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  required?: boolean;
}

export function SettingsLabel({
  label,
  htmlFor,
  required,
}: SettingsLabelProps) {
  const labelId =
    htmlFor || `label-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label htmlFor={labelId} className="block text-sm font-medium mb-1.5 pl-1">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}
