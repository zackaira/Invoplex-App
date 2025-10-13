interface SettingsHelperTextProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
}

export function SettingsHelperText({ text }: SettingsHelperTextProps) {
  return <p className="text-xs text-muted-foreground pl-1">{text}</p>;
}
