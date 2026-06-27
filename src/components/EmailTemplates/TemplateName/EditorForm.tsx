"use client";

import { RefObject } from "react";
import { Template } from "@/actions/emailTemplatesActions";
import { ChannelTab } from "@/hooks/useTemplateEditor";

interface EditorFormProps {
    activeTab: ChannelTab;
    templateName: string;
    currentTemplate?: Template;
    isCreating?: boolean;
    fromEmail: string;
    subject: string;
    country: string;
    language: string;
    smsProvider: "Twilio" | "GAMA";
    bodyText: string;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    availableVariables: string[];
    onTemplateNameChange?: (v: string) => void;
    onFromEmailChange: (v: string) => void;
    onSubjectChange: (v: string) => void;
    onCountryChange: (v: string) => void;
    onLanguageChange: (v: string) => void;
    onSmsProviderChange: (v: "Twilio" | "GAMA") => void;
    onBodyTextChange: (v: string) => void;
    onInsertVariable: (token: string) => void;
}

const INPUT_CLASS =
    "w-full h-[42px] px-3 border border-border bg-card text-text rounded-md text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-sans";

const INPUT_DISABLED_CLASS =
    "w-full h-[42px] px-3 border border-border bg-page text-muted rounded-md text-sm font-medium cursor-not-allowed font-sans";

const SELECT_CLASS =
    "w-full h-[42px] px-3 border border-border bg-card text-text rounded-md text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-sans cursor-pointer appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]";

const LABEL_CLASS = "text-[13px] text-muted font-medium font-sans";

const EditorForm = ({
    activeTab,
    templateName,
    currentTemplate,
    isCreating = false,
    fromEmail,
    subject,
    country,
    language,
    smsProvider,
    bodyText,
    textareaRef,
    availableVariables,
    onTemplateNameChange,
    onFromEmailChange,
    onSubjectChange,
    onCountryChange,
    onLanguageChange,
    onSmsProviderChange,
    onBodyTextChange,
    onInsertVariable,
}: EditorFormProps) => {
    return (
        <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Template name */}
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>Template name</label>
                {isCreating ? (
                    <div className="relative w-full">
                        <select
                            value={templateName}
                            onChange={(e) => onTemplateNameChange?.(e.target.value)}
                            className={`${SELECT_CLASS} pr-10`}
                        >
                            <option value="">Select template name</option>
                            <option value="otp">otp</option>
                            <option value="signup">signup</option>
                            <option value="verify">verify</option>
                            <option value="welcome">welcome</option>
                            <option value="agent_portal_welcome">agent_portal_welcome</option>
                            <option value="forgot_password">forgot_password</option>
                            <option value="two_fa">two_fa</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={templateName}
                        disabled
                        className={INPUT_DISABLED_CLASS}
                    />
                )}
            </div>

            {/* From (email / number) */}
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>From (email / number)</label>
                <input
                    type="text"
                    value={fromEmail}
                    onChange={(e) => onFromEmailChange(e.target.value)}
                    placeholder="e.g. info@homeby.com.au"
                    className={INPUT_CLASS}
                />
            </div>

            {/* Subject / Title */}
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>
                    {activeTab === "Email" ? "Subject" : "Title"}
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                    placeholder={
                        activeTab === "Email"
                            ? "Email Subject Line"
                            : "Title text"
                    }
                    className={INPUT_CLASS}
                />
            </div>

            {/* Variable Insert Palette */}
            <div className="flex flex-col gap-2">
                <label className={`${LABEL_CLASS} select-none`}>
                    Click to insert variable
                </label>
                <div className="flex flex-wrap gap-2">
                    {availableVariables.map((token) => (
                        <button
                            key={token}
                            type="button"
                            onClick={() => onInsertVariable(token)}
                            className="px-3 py-1.5 border border-border bg-card hover:bg-page text-muted hover:text-text rounded-md text-xs font-medium font-sans transition-colors cursor-pointer select-none"
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body Editor */}
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>Template body</label>
                <textarea
                    ref={textareaRef}
                    value={bodyText}
                    onChange={(e) => onBodyTextChange(e.target.value)}
                    rows={14}
                    className="w-full bg-[#0F1115] text-[#ECEFF4] font-mono text-sm p-5 rounded-lg border border-[#2E3440] focus:outline-none focus:ring-1 focus:ring-accent/60 leading-relaxed tracking-normal overflow-y-auto resize-y min-h-[320px]"
                    placeholder="Write transactional template body here..."
                />
            </div>

            {/* Country + Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Country</label>
                    <div className="relative">
                        <select
                            value={country}
                            onChange={(e) => onCountryChange(e.target.value)}
                            className={`${SELECT_CLASS} pr-10`}
                        >
                            <option value="AF">Afghanistan</option>
                            <option value="AL">Albania</option>
                            <option value="DZ">Algeria</option>
                            <option value="AS">American Samoa</option>
                            <option value="AD">Andorra</option>
                            <option value="AO">Angola</option>
                            <option value="AI">Anguilla</option>
                            <option value="AQ">Antarctica</option>
                            <option value="AG">Antigua and Barbuda</option>
                            <option value="AR">Argentina</option>
                            <option value="AM">Armenia</option>
                            <option value="AW">Aruba</option>
                            <option value="AU">Australia</option>
                            <option value="AT">Austria</option>
                            <option value="AZ">Azerbaijan</option>
                            <option value="BS">Bahamas</option>
                            <option value="BH">Bahrain</option>
                            <option value="BD">Bangladesh</option>
                            <option value="BB">Barbados</option>
                            <option value="BY">Belarus</option>
                            <option value="BE">Belgium</option>
                            <option value="BZ">Belize</option>
                            <option value="BJ">Benin</option>
                            <option value="BM">Bermuda</option>
                            <option value="BT">Bhutan</option>
                            <option value="BO">Bolivia</option>
                            <option value="BA">Bosnia and Herzegovina</option>
                            <option value="BW">Botswana</option>
                            <option value="BR">Brazil</option>
                            <option value="BN">Brunei</option>
                            <option value="BG">Bulgaria</option>
                            <option value="BF">Burkina Faso</option>
                            <option value="BI">Burundi</option>
                            <option value="CV">Cabo Verde</option>
                            <option value="KH">Cambodia</option>
                            <option value="CM">Cameroon</option>
                            <option value="CA">Canada</option>
                            <option value="KY">Cayman Islands</option>
                            <option value="CF">Central African Republic</option>
                            <option value="TD">Chad</option>
                            <option value="CL">Chile</option>
                            <option value="CN">China</option>
                            <option value="CO">Colombia</option>
                            <option value="KM">Comoros</option>
                            <option value="CG">Congo</option>
                            <option value="CD">Congo (DRC)</option>
                            <option value="CK">Cook Islands</option>
                            <option value="CR">Costa Rica</option>
                            <option value="CI">Cote d&apos;Ivoire</option>
                            <option value="HR">Croatia</option>
                            <option value="CU">Cuba</option>
                            <option value="CW">Curacao</option>
                            <option value="CY">Cyprus</option>
                            <option value="CZ">Czech Republic</option>
                            <option value="DK">Denmark</option>
                            <option value="DJ">Djibouti</option>
                            <option value="DM">Dominica</option>
                            <option value="DO">Dominican Republic</option>
                            <option value="EC">Ecuador</option>
                            <option value="EG">Egypt</option>
                            <option value="SV">El Salvador</option>
                            <option value="GQ">Equatorial Guinea</option>
                            <option value="ER">Eritrea</option>
                            <option value="EE">Estonia</option>
                            <option value="SZ">Eswatini</option>
                            <option value="ET">Ethiopia</option>
                            <option value="FK">Falkland Islands</option>
                            <option value="FO">Faroe Islands</option>
                            <option value="FJ">Fiji</option>
                            <option value="FI">Finland</option>
                            <option value="FR">France</option>
                            <option value="GF">French Guiana</option>
                            <option value="PF">French Polynesia</option>
                            <option value="GA">Gabon</option>
                            <option value="GM">Gambia</option>
                            <option value="GE">Georgia</option>
                            <option value="DE">Germany</option>
                            <option value="GH">Ghana</option>
                            <option value="GI">Gibraltar</option>
                            <option value="GR">Greece</option>
                            <option value="GL">Greenland</option>
                            <option value="GD">Grenada</option>
                            <option value="GP">Guadeloupe</option>
                            <option value="GU">Guam</option>
                            <option value="GT">Guatemala</option>
                            <option value="GG">Guernsey</option>
                            <option value="GN">Guinea</option>
                            <option value="GW">Guinea-Bissau</option>
                            <option value="GY">Guyana</option>
                            <option value="HT">Haiti</option>
                            <option value="HN">Honduras</option>
                            <option value="HK">Hong Kong</option>
                            <option value="HU">Hungary</option>
                            <option value="IS">Iceland</option>
                            <option value="IN">India</option>
                            <option value="ID">Indonesia</option>
                            <option value="IR">Iran</option>
                            <option value="IQ">Iraq</option>
                            <option value="IE">Ireland</option>
                            <option value="IM">Isle of Man</option>
                            <option value="IL">Israel</option>
                            <option value="IT">Italy</option>
                            <option value="JM">Jamaica</option>
                            <option value="JP">Japan</option>
                            <option value="JE">Jersey</option>
                            <option value="JO">Jordan</option>
                            <option value="KZ">Kazakhstan</option>
                            <option value="KE">Kenya</option>
                            <option value="KI">Kiribati</option>
                            <option value="KP">North Korea</option>
                            <option value="KR">South Korea</option>
                            <option value="KW">Kuwait</option>
                            <option value="KG">Kyrgyzstan</option>
                            <option value="LA">Laos</option>
                            <option value="LV">Latvia</option>
                            <option value="LB">Lebanon</option>
                            <option value="LS">Lesotho</option>
                            <option value="LR">Liberia</option>
                            <option value="LY">Libya</option>
                            <option value="LI">Liechtenstein</option>
                            <option value="LT">Lithuania</option>
                            <option value="LU">Luxembourg</option>
                            <option value="MO">Macau</option>
                            <option value="MK">North Macedonia</option>
                            <option value="MG">Madagascar</option>
                            <option value="MW">Malawi</option>
                            <option value="MY">Malaysia</option>
                            <option value="MV">Maldives</option>
                            <option value="ML">Mali</option>
                            <option value="MT">Malta</option>
                            <option value="MH">Marshall Islands</option>
                            <option value="MQ">Martinique</option>
                            <option value="MR">Mauritania</option>
                            <option value="MU">Mauritius</option>
                            <option value="YT">Mayotte</option>
                            <option value="MX">Mexico</option>
                            <option value="FM">Micronesia</option>
                            <option value="MD">Moldova</option>
                            <option value="MC">Monaco</option>
                            <option value="MN">Mongolia</option>
                            <option value="ME">Montenegro</option>
                            <option value="MS">Montserrat</option>
                            <option value="MA">Morocco</option>
                            <option value="MZ">Mozambique</option>
                            <option value="MM">Myanmar</option>
                            <option value="NA">Namibia</option>
                            <option value="NR">Nauru</option>
                            <option value="NP">Nepal</option>
                            <option value="NL">Netherlands</option>
                            <option value="NC">New Caledonia</option>
                            <option value="NZ">New Zealand</option>
                            <option value="NI">Nicaragua</option>
                            <option value="NE">Niger</option>
                            <option value="NG">Nigeria</option>
                            <option value="NU">Niue</option>
                            <option value="NF">Norfolk Island</option>
                            <option value="MP">Northern Mariana Islands</option>
                            <option value="NO">Norway</option>
                            <option value="OM">Oman</option>
                            <option value="PK">Pakistan</option>
                            <option value="PW">Palau</option>
                            <option value="PS">Palestine</option>
                            <option value="PA">Panama</option>
                            <option value="PG">Papua New Guinea</option>
                            <option value="PY">Paraguay</option>
                            <option value="PE">Peru</option>
                            <option value="PH">Philippines</option>
                            <option value="PL">Poland</option>
                            <option value="PT">Portugal</option>
                            <option value="PR">Puerto Rico</option>
                            <option value="QA">Qatar</option>
                            <option value="RE">Reunion</option>
                            <option value="RO">Romania</option>
                            <option value="RU">Russia</option>
                            <option value="RW">Rwanda</option>
                            <option value="BL">Saint Barthelemy</option>
                            <option value="SH">Saint Helena</option>
                            <option value="KN">Saint Kitts and Nevis</option>
                            <option value="LC">Saint Lucia</option>
                            <option value="MF">Saint Martin</option>
                            <option value="PM">Saint Pierre and Miquelon</option>
                            <option value="VC">Saint Vincent and the Grenadines</option>
                            <option value="WS">Samoa</option>
                            <option value="SM">San Marino</option>
                            <option value="ST">Sao Tome and Principe</option>
                            <option value="SA">Saudi Arabia</option>
                            <option value="SN">Senegal</option>
                            <option value="RS">Serbia</option>
                            <option value="SC">Seychelles</option>
                            <option value="SL">Sierra Leone</option>
                            <option value="SG">Singapore</option>
                            <option value="SX">Sint Maarten</option>
                            <option value="SK">Slovakia</option>
                            <option value="SI">Slovenia</option>
                            <option value="SB">Solomon Islands</option>
                            <option value="SO">Somalia</option>
                            <option value="ZA">South Africa</option>
                            <option value="SS">South Sudan</option>
                            <option value="ES">Spain</option>
                            <option value="LK">Sri Lanka</option>
                            <option value="SD">Sudan</option>
                            <option value="SR">Suriname</option>
                            <option value="SJ">Svalbard and Jan Mayen</option>
                            <option value="SE">Sweden</option>
                            <option value="CH">Switzerland</option>
                            <option value="SY">Syria</option>
                            <option value="TW">Taiwan</option>
                            <option value="TJ">Tajikistan</option>
                            <option value="TZ">Tanzania</option>
                            <option value="TH">Thailand</option>
                            <option value="TL">Timor-Leste</option>
                            <option value="TG">Togo</option>
                            <option value="TK">Tokelau</option>
                            <option value="TO">Tonga</option>
                            <option value="TT">Trinidad and Tobago</option>
                            <option value="TN">Tunisia</option>
                            <option value="TR">Turkey</option>
                            <option value="TM">Turkmenistan</option>
                            <option value="TC">Turks and Caicos Islands</option>
                            <option value="TV">Tuvalu</option>
                            <option value="UG">Uganda</option>
                            <option value="UA">Ukraine</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="UY">Uruguay</option>
                            <option value="UZ">Uzbekistan</option>
                            <option value="VU">Vanuatu</option>
                            <option value="VA">Vatican City</option>
                            <option value="VE">Venezuela</option>
                            <option value="VN">Vietnam</option>
                            <option value="VG">British Virgin Islands</option>
                            <option value="VI">U.S. Virgin Islands</option>
                            <option value="WF">Wallis and Futuna</option>
                            <option value="EH">Western Sahara</option>
                            <option value="YE">Yemen</option>
                            <option value="ZM">Zambia</option>
                            <option value="ZW">Zimbabwe</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Language</label>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className={`${SELECT_CLASS} pr-10`}
                        >
                            <option value="English">English</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* SMS Provider */}
            <div className="flex flex-col gap-2 select-none mb-2">
                <label className={LABEL_CLASS}>SMS provider</label>
                <div className="flex gap-2">
                    {(["Twilio", "GAMA"] as const).map((provider) => (
                        <button
                            key={provider}
                            type="button"
                            onClick={() => onSmsProviderChange(provider)}
                            className={`px-5 py-2.5 rounded-md text-sm font-semibold font-sans transition-colors cursor-pointer border ${
                                smsProvider === provider
                                    ? "bg-text text-white border-text"
                                    : "bg-card border-border text-text hover:bg-page"
                            }`}
                        >
                            {provider}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditorForm;
