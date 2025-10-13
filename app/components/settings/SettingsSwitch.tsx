"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SettingsLabel } from "./SettingsLabel";
import { SettingsHelperText } from "./SettingsHelperText";

interface SettingsSwitchProps {
  label: string;
  helperText?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

export function SettingsSwitch({
  label,
  helperText,
  checked,
  defaultChecked,
  onCheckedChange,
  name,
  disabled,
  className,
}: SettingsSwitchProps) {
  const switchId = `switch-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className={cn("flex items-center justify-between space-x-4", className)}
    >
      <div className="flex-1 space-y-0.5">
        <SettingsLabel htmlFor={switchId} label={label} />

        {helperText && <SettingsHelperText text={helperText} />}
      </div>
      <Switch
        id={switchId}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
