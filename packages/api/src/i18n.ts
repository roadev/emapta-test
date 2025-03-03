import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";
import path from "path";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "es"],
    debug: false,
    backend: {
      loadPath: path.join(__dirname, "./locales/{{lng}}/{{ns}}.json")
    },
    ns: ["translation"],
    defaultNS: "translation",
    detection: {
      order: ["querystring", "header"],
      lookupQuerystring: "lng",
      caches: false
    }
});

export default i18next;