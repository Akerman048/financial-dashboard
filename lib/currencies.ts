export type CurrencyOption = {
  code: string;
  label: string;
  locale: string;
  symbol?: string;
};

const PRIORITY_ORDER = ["EUR", "USD", "UAH"];

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", locale: "en-US", symbol: "$" },
  { code: "EUR", label: "Euro", locale: "de-DE", symbol: "€" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP", symbol: "¥" },
  { code: "GBP", label: "British Pound", locale: "en-GB", symbol: "£" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU", symbol: "$" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA", symbol: "$" },
  { code: "CHF", label: "Swiss Franc", locale: "de-CH", symbol: "CHF" },
  { code: "CNY", label: "Chinese Yuan", locale: "zh-CN", symbol: "¥" },
  { code: "HKD", label: "Hong Kong Dollar", locale: "zh-HK", symbol: "$" },
  { code: "NZD", label: "New Zealand Dollar", locale: "en-NZ", symbol: "$" },

  { code: "SEK", label: "Swedish Krona", locale: "sv-SE", symbol: "kr" },
  { code: "NOK", label: "Norwegian Krone", locale: "nb-NO", symbol: "kr" },
  { code: "DKK", label: "Danish Krone", locale: "da-DK", symbol: "kr" },
  { code: "ISK", label: "Icelandic Króna", locale: "is-IS", symbol: "kr" },
  { code: "PLN", label: "Polish Złoty", locale: "pl-PL", symbol: "zł" },
  { code: "CZK", label: "Czech Koruna", locale: "cs-CZ", symbol: "Kč" },
  { code: "HUF", label: "Hungarian Forint", locale: "hu-HU", symbol: "Ft" },
  { code: "RON", label: "Romanian Leu", locale: "ro-RO", symbol: "lei" },
  { code: "BGN", label: "Bulgarian Lev", locale: "bg-BG", symbol: "лв" },
  { code: "HRK", label: "Croatian Kuna", locale: "hr-HR", symbol: "kn" },

  { code: "UAH", label: "Ukrainian Hryvnia", locale: "uk-UA", symbol: "₴" },
  { code: "TRY", label: "Turkish Lira", locale: "tr-TR", symbol: "₺" },
  { code: "RUB", label: "Russian Ruble", locale: "ru-RU", symbol: "₽" },
  { code: "ILS", label: "Israeli New Shekel", locale: "he-IL", symbol: "₪" },
  { code: "AED", label: "UAE Dirham", locale: "ar-AE", symbol: "د.إ" },
  { code: "SAR", label: "Saudi Riyal", locale: "ar-SA", symbol: "﷼" },
  { code: "QAR", label: "Qatari Riyal", locale: "ar-QA", symbol: "ر.ق" },
  { code: "KWD", label: "Kuwaiti Dinar", locale: "ar-KW", symbol: "د.ك" },
  { code: "BHD", label: "Bahraini Dinar", locale: "ar-BH", symbol: "د.ب" },
  { code: "OMR", label: "Omani Rial", locale: "ar-OM", symbol: "ر.ع." },

  { code: "INR", label: "Indian Rupee", locale: "en-IN", symbol: "₹" },
  { code: "PKR", label: "Pakistani Rupee", locale: "ur-PK", symbol: "₨" },
  { code: "BDT", label: "Bangladeshi Taka", locale: "bn-BD", symbol: "৳" },
  { code: "LKR", label: "Sri Lankan Rupee", locale: "si-LK", symbol: "Rs" },
  { code: "NPR", label: "Nepalese Rupee", locale: "ne-NP", symbol: "₨" },
  { code: "THB", label: "Thai Baht", locale: "th-TH", symbol: "฿" },
  { code: "VND", label: "Vietnamese Dong", locale: "vi-VN", symbol: "₫" },
  { code: "IDR", label: "Indonesian Rupiah", locale: "id-ID", symbol: "Rp" },
  { code: "MYR", label: "Malaysian Ringgit", locale: "ms-MY", symbol: "RM" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG", symbol: "$" },

  { code: "KRW", label: "South Korean Won", locale: "ko-KR", symbol: "₩" },
  { code: "TWD", label: "New Taiwan Dollar", locale: "zh-TW", symbol: "NT$" },
  { code: "PHP", label: "Philippine Peso", locale: "en-PH", symbol: "₱" },
  { code: "MOP", label: "Macanese Pataca", locale: "zh-MO", symbol: "MOP$" },
  { code: "BND", label: "Brunei Dollar", locale: "ms-BN", symbol: "$" },
  { code: "KZT", label: "Kazakhstani Tenge", locale: "kk-KZ", symbol: "₸" },
  { code: "UZS", label: "Uzbekistani Som", locale: "uz-UZ", symbol: "so'm" },
  { code: "GEL", label: "Georgian Lari", locale: "ka-GE", symbol: "₾" },
  { code: "AMD", label: "Armenian Dram", locale: "hy-AM", symbol: "֏" },
  { code: "AZN", label: "Azerbaijani Manat", locale: "az-AZ", symbol: "₼" },

  { code: "ZAR", label: "South African Rand", locale: "en-ZA", symbol: "R" },
  { code: "EGP", label: "Egyptian Pound", locale: "ar-EG", symbol: "£" },
  { code: "MAD", label: "Moroccan Dirham", locale: "fr-MA", symbol: "د.م." },
  { code: "TND", label: "Tunisian Dinar", locale: "ar-TN", symbol: "د.ت" },
  { code: "KES", label: "Kenyan Shilling", locale: "en-KE", symbol: "KSh" },
  { code: "GHS", label: "Ghanaian Cedi", locale: "en-GH", symbol: "₵" },
  { code: "NGN", label: "Nigerian Naira", locale: "en-NG", symbol: "₦" },
  { code: "ETB", label: "Ethiopian Birr", locale: "am-ET", symbol: "Br" },
  { code: "UGX", label: "Ugandan Shilling", locale: "en-UG", symbol: "USh" },
  { code: "TZS", label: "Tanzanian Shilling", locale: "sw-TZ", symbol: "TSh" },

  { code: "XOF", label: "West African CFA Franc", locale: "fr-SN", symbol: "CFA" },
  { code: "XAF", label: "Central African CFA Franc", locale: "fr-CM", symbol: "FCFA" },
  { code: "MUR", label: "Mauritian Rupee", locale: "en-MU", symbol: "₨" },
  { code: "RWF", label: "Rwandan Franc", locale: "rw-RW", symbol: "FRw" },
  { code: "ZMW", label: "Zambian Kwacha", locale: "en-ZM", symbol: "ZK" },
  { code: "BWP", label: "Botswanan Pula", locale: "en-BW", symbol: "P" },
  { code: "NAD", label: "Namibian Dollar", locale: "en-NA", symbol: "$" },
  { code: "MZN", label: "Mozambican Metical", locale: "pt-MZ", symbol: "MT" },
  { code: "AOA", label: "Angolan Kwanza", locale: "pt-AO", symbol: "Kz" },
  { code: "DZD", label: "Algerian Dinar", locale: "ar-DZ", symbol: "د.ج" },

  { code: "BRL", label: "Brazilian Real", locale: "pt-BR", symbol: "R$" },
  { code: "MXN", label: "Mexican Peso", locale: "es-MX", symbol: "$" },
  { code: "ARS", label: "Argentine Peso", locale: "es-AR", symbol: "$" },
  { code: "CLP", label: "Chilean Peso", locale: "es-CL", symbol: "$" },
  { code: "COP", label: "Colombian Peso", locale: "es-CO", symbol: "$" },
  { code: "PEN", label: "Peruvian Sol", locale: "es-PE", symbol: "S/" },
  { code: "UYU", label: "Uruguayan Peso", locale: "es-UY", symbol: "$U" },
  { code: "PYG", label: "Paraguayan Guaraní", locale: "es-PY", symbol: "₲" },
  { code: "BOB", label: "Bolivian Boliviano", locale: "es-BO", symbol: "Bs" },
  { code: "VES", label: "Venezuelan Bolívar", locale: "es-VE", symbol: "Bs." },

  { code: "DOP", label: "Dominican Peso", locale: "es-DO", symbol: "RD$" },
  { code: "CRC", label: "Costa Rican Colón", locale: "es-CR", symbol: "₡" },
  { code: "GTQ", label: "Guatemalan Quetzal", locale: "es-GT", symbol: "Q" },
  { code: "HNL", label: "Honduran Lempira", locale: "es-HN", symbol: "L" },
  { code: "NIO", label: "Nicaraguan Córdoba", locale: "es-NI", symbol: "C$" },
  { code: "PAB", label: "Panamanian Balboa", locale: "es-PA", symbol: "B/." },
  { code: "JMD", label: "Jamaican Dollar", locale: "en-JM", symbol: "J$" },
  { code: "TTD", label: "Trinidad and Tobago Dollar", locale: "en-TT", symbol: "TT$" },
  { code: "BBD", label: "Barbadian Dollar", locale: "en-BB", symbol: "Bds$" },
  { code: "BSD", label: "Bahamian Dollar", locale: "en-BS", symbol: "B$" },

  { code: "ALL", label: "Albanian Lek", locale: "sq-AL", symbol: "L" },
  { code: "MKD", label: "Macedonian Denar", locale: "mk-MK", symbol: "ден" },
  { code: "RSD", label: "Serbian Dinar", locale: "sr-RS", symbol: "дин." },
  { code: "BAM", label: "Bosnia-Herzegovina Convertible Mark", locale: "bs-BA", symbol: "KM" },
  { code: "MDL", label: "Moldovan Leu", locale: "ro-MD", symbol: "L" },
  { code: "BYN", label: "Belarusian Ruble", locale: "be-BY", symbol: "Br" },
  { code: "JOD", label: "Jordanian Dinar", locale: "ar-JO", symbol: "د.أ" },
  { code: "LBP", label: "Lebanese Pound", locale: "ar-LB", symbol: "ل.ل" },
  { code: "IRR", label: "Iranian Rial", locale: "fa-IR", symbol: "﷼" },
  { code: "IQD", label: "Iraqi Dinar", locale: "ar-IQ", symbol: "ع.د" },
]


export const SORTED_CURRENCIES = [...CURRENCIES].sort((a, b) => {
  const aPriority = PRIORITY_ORDER.indexOf(a.code);
  const bPriority = PRIORITY_ORDER.indexOf(b.code);

  const aIsPriority = aPriority !== -1;
  const bIsPriority = bPriority !== -1;

  if (aIsPriority && bIsPriority) {
    return aPriority - bPriority;
  }

  if (aIsPriority) return -1;
  if (bIsPriority) return 1;

  return a.label.localeCompare(b.label);
});