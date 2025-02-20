import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import {AppSelect} from "./$widgets/form-inputs";
import {Languages} from "../config/constants";

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [locale, setLocale] = useState(i18n.language);

    const changeLanguage = async (lng) => {
        setLocale(lng);
        await i18n.changeLanguage(lng);
    };

    return (
        <div className="row mt-4 mx-3">
            <AppSelect name={'language'}
                       value={locale}
                       label={'Language'}
                       fullwidth={true}
                       onChange={(e) => changeLanguage(e.target.value)}
                       className="my-0"
                       options={Languages}/>
        </div>
    );
}
