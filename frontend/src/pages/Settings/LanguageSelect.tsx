import { useTranslation } from "react-i18next";

const LanguageSelect = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language); // Persist the selection
  };

  return (
    <div className="p-4">
      <h1>{t("settings.title")}</h1>

      <div>
        <label>{t("settings.languageLabel")}</label>
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
          className="ml-2 p-1"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
};
export default LanguageSelect;
