import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { LANGUAGES } from "../../i18n/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Globe } from "lucide-react";

export default function LanguageSelector({ className = "" }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Globe className="w-4 h-4 text-muted-foreground hidden sm:block" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger
          className="h-9 w-[110px] font-body text-xs border-border"
          aria-label={t("language.label")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="font-body text-sm">
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
